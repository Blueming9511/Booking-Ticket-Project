import React, { useState, useEffect } from 'react';
import { Form, Button, Input, List, Avatar, message, Card, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { commentService } from '../Auth/apiService';

const { TextArea } = Input;

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const CommentSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (movieId) {
      fetchComments();
    }
  }, [movieId, currentPage]);

  const checkAuthStatus = () => {
    const token = Cookies.get('accessToken');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.sub) {
        setIsLoggedIn(true);
        setCurrentUser({
          id: decoded.sub,
          name: decoded.name || 'User',
          email: decoded.email
        });
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentService.getMovieComments(movieId, currentPage - 1, pageSize);
      const commentsData = response.content.map(comment => ({
        ...comment,
        userName: comment.userName || 'Anonymous'
      }));
      setComments(commentsData);
      setTotalComments(response.totalElements);
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error('Failed to load comments');
    }
  };

  const handleSubmit = async (values) => {
    if (!isLoggedIn) {
      message.warning('Please login to comment');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        movieId,
        content: values.content,
        userId: currentUser.id,
        status: 'ACTIVE'
      };

      await commentService.addComment(commentData);
      message.success('Comment posted successfully');
      form.resetFields();
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      message.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    try {
      const existingComment = comments.find(c => c.id === editingCommentId);
      if (!existingComment) {
        message.error('Comment not found');
        return;
      }

      await commentService.updateComment(editingCommentId, {
        id: editingCommentId,
        content: values.content,
        isEdited: true
      });

      message.success('Comment updated successfully');
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error('Please log in to edit comments');
        navigate('/login');
        return;
      }
      message.error(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      message.success('Comment deleted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const startEditing = (comment) => {
    editForm.setFieldsValue({ content: comment.content });
    setEditingCommentId(comment.id);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    editForm.resetFields();
  };

  return (
    <Card className="comment-section">
      <h3 className='text-2xl font-bold mb-3'>Comments</h3>
      {isLoggedIn ? (
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="content" rules={[{ required: true, message: 'Please write your comment' }]}>
            <TextArea rows={4} placeholder="Write your comment here..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" danger htmlType="submit" loading={submitting}>
              Post Comment
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Button type="primary" danger onClick={handleLoginClick}>
          Login to Comment
        </Button>
      )}

      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={[...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
        pagination={{
          onChange: setCurrentPage,
          current: currentPage,
          pageSize: pageSize,
          total: totalComments,
          showSizeChanger: false
        }}
        renderItem={comment => (
          <List.Item
            // actions={
            //   currentUser?.id === comment.userId
            //     ? [
            //         editingCommentId === comment.id ? (
            //           <>
            //             <Button type="link" onClick={() => editForm.submit()}>Save</Button>
            //             <Button type="link" onClick={cancelEditing}>Cancel</Button>
            //           </>
            //         ) : (
            //           <>
            //             <Button type="link" icon={<EditOutlined />} onClick={() => startEditing(comment)}>
            //               Edit
            //             </Button>
            //             <Popconfirm
            //               title="Are you sure you want to delete this comment?"
            //               onConfirm={() => handleDelete(comment.id)}
            //               okText="Yes"
            //               cancelText="No"
            //             >
            //               <Button type="link" danger icon={<DeleteOutlined />}>
            //                 Delete
            //               </Button>
            //             </Popconfirm>
            //           </>
            //         )
            //       ]
            //     : []
            // }
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={comment.userName}
              description={
                editingCommentId === comment.id ? (
                  <Form form={editForm} onFinish={handleEdit}>
                    <Form.Item name="content" rules={[{ required: true, message: 'Comment cannot be empty' }]}>
                      <TextArea rows={3} />
                    </Form.Item>
                  </Form>
                ) : (
                  <>
                    <div>{comment.content}</div>
                    {comment.isEdited && <small className="text-gray-500">(edited)</small>}
                    <div className="text-gray-400 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CommentSection;