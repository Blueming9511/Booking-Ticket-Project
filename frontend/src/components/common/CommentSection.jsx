import React, { useState, useEffect } from 'react';
import { Form, Button, Input, List, Avatar, message, Card, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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
    console.log("movieId ne", movieId);
  const [comments, setComments] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const pageSize = 5;
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
      console.log("Fetching comments for movieId:", movieId);
      const response = await axios.get(
        `${API_URL}/comments/movie/${movieId}?page=${currentPage - 1}&size=${pageSize}`,
        { withCredentials: true }
      );
      console.log("Comments API response:", response.data);
      
      // Fetch user details for each comment
      const commentsWithUserDetails = await Promise.all(
        response.data.content.map(async (comment) => {
          try {
            const userResponse = await axios.get(`${API_URL}/users/${comment.userId}`, {
              withCredentials: true
            });
            return {
              ...comment,
              userName: userResponse.data.name || 'Unknown User'
            };
          } catch (error) {
            console.error('Error fetching user details:', error);
            if (error.response) {
              console.error('Error response:', error.response.data);
              console.error('Error status:', error.response.status);
            }
            return {
              ...comment,
              userName: 'Unknown User'
            };
          }
        })
      );

      setComments(commentsWithUserDetails);
      setTotalComments(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
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
      
      console.log('Submitting comment with data:', commentData);

      const response = await axios.post(
        `${API_URL}/comments/`,
        commentData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Comment post response:', response);
      message.success('Comment posted successfully');
      form.resetFields();
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        message.error(`Failed to post comment: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        message.error('Failed to post comment: No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        message.error(`Failed to post comment: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    console.log("values", values);
    console.log("editingCommentId", editingCommentId);
    try {
      // Find the existing comment
      const existingComment = comments.find(c => c.id === editingCommentId);
      if (!existingComment) {
        message.error('Comment not found');
        return;
      }

      // Ensure API_URL is using the correct protocol
      const apiUrl = API_URL.startsWith('http') ? API_URL : `http://${API_URL}`;

      const response = await axios.put(
        `${apiUrl}/comments/${editingCommentId}`,
        {
          id: editingCommentId,
          content: values.content,
          edited: true
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      if (response.status === 200) {
        message.success('Comment updated successfully');
        setEditingCommentId(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error('Please log in to edit comments');
        // Store current state
        localStorage.setItem('pendingCommentEdit', JSON.stringify({
          commentId: editingCommentId,
          content: values.content
        }));
        // Redirect to login
        window.location.href = '/login';
        return;
      }

      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        message.error('Network error. Please check your connection and try again.');
        return;
      }

      // Handle other errors
      message.error(
        error.response?.data?.message || 
        'Failed to update comment. Please try again.'
      );
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        withCredentials: true
      });
      message.success('Comment deleted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error.response?.status === 403) {
        message.error('You can only delete your own comments');
      } else {
        message.error('Failed to delete comment');
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    editForm.setFieldsValue({ content: comment.content });
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    editForm.resetFields();
  };

  if (!movieId) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      </div>  

      {isLoggedIn ? (
        <Form
          form={form}
          onFinish={handleSubmit}
          className="mb-8"
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Please write your comment' }]}
          >
            <TextArea
              rows={4}
              placeholder="Write your review here..."
              className="border-red-200 focus:border-red-500"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              danger={true}
              loading={submitting}
              className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
            >
              Post Review
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="mb-8 text-center">
          <p className="mb-4 text-gray-600">Please login to post a review</p>
          <Button
            type="primary"
            onClick={handleLoginClick}
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
          >
            Login to Review
          </Button>
        </div>
      )}

      <List
        className="comment-list"
        header={`${totalComments} reviews`}
        itemLayout="vertical"
        dataSource={comments}
        pagination={{
          onChange: setCurrentPage,
          current: currentPage,
          pageSize,
          total: totalComments,
          className: "mt-4"
        }}
        renderItem={(comment) => (
          <Card className="mb-4">
            <div className="flex items-start space-x-4 ">
              <Avatar icon={<UserOutlined />} className="bg-red-500 mx-3 " />
              <div className="flex-1">
                <div className="flex items-center justify-between ml-3">
                  <span className="text-red-600 font-semibold">{comment.userName}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                      {comment.isEdited && ' (edited)'}
                    </span>
                    {currentUser && currentUser.id === comment.userId && (
                      <div className="flex space-x-2">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => startEditing(comment)}
                          className="text-blue-500 hover:text-blue-600"
                        />
                        <Popconfirm
                          title="Delete this comment?"
                          onConfirm={() => handleDelete(comment.id)}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
                        >
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-500 hover:text-red-600"
                          />
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                </div>
                {editingCommentId === comment.id ? (
                  <Form
                    form={editForm}
                    onFinish={handleEdit}
                    className="mt-2"
                  >
                    <Form.Item
                      name="content"
                      rules={[{ required: true, message: 'Please write your comment' }]}
                    >
                      <TextArea
                        rows={3}
                        className="border-red-200 focus:border-red-500"
                      />
                    </Form.Item>
                    <Form.Item>
                      <div className="flex space-x-2">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
                        >
                          Save
                        </Button>
                        <Button onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                ) : (
                  <p className="text-gray-700 mt-2">{comment.content}</p>
                )}
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default CommentSection;