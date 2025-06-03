package com.cibook.bookingticket.service;

import com.cibook.bookingticket.model.Comment;
import com.cibook.bookingticket.repository.CommentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;

@Slf4j
@Service
public class CommentService implements IService<Comment, String> {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment add(Comment entity) {
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(entity);
    }

    @Override
    public Optional<Comment> findById(String id) {
        return commentRepository.findById(id);
    }

    @Override
    public Optional<Comment> findByCode(String code) {
        return Optional.empty();
    }

    @Override
    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    @Override
    public Page<Comment> findAll(Pageable pageable) {
        return commentRepository.findAll(pageable);
    }

    @Override
    public Map<String, String> findAllNamesWithID() {
        return new HashMap<>();
    }

    @Override
    public Comment update(String id, Comment entity) {
        return commentRepository.findById(id)
                .map(existingComment -> {
                    // Validate that the user is updating their own comment
                    if (!existingComment.getUserId().equals(entity.getUserId())) {
                        throw new AccessDeniedException("You can only edit your own comments");
                    }
                    
                    entity.setId(existingComment.getId());
                    entity.setCreatedAt(existingComment.getCreatedAt());
                    entity.setUpdatedAt(LocalDateTime.now());
                    entity.setEdited(true);
                    return commentRepository.save(entity);
                })
                .orElseThrow(() -> new NoSuchElementException("Comment not found with ID: " + id));
    }

    @Override
    public void deleteById(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comment not found with ID: " + id));
        
        // Instead of deleting, mark as DELETED
        comment.setStatus(Comment.CommentStatus.DELETED);
        commentRepository.save(comment);
    }

    @Override
    public boolean existsById(String id) {
        return commentRepository.existsById(id);
    }

    public Page<Comment> findByMovieId(String movieId, Pageable pageable) {
        log.debug("Finding comments for movieId: {}", movieId);
        Page<Comment> comments = commentRepository.findByMovieId(movieId, pageable);
        log.debug("Found {} comments", comments.getTotalElements());
        return comments;
    }

    public Page<Comment> findByUserId(String userId, Pageable pageable) {
        return commentRepository.findByUserId(userId, pageable);
    }

    public List<Comment> findActiveCommentsByMovieId(String movieId) {
        return commentRepository.findByMovieIdAndStatus(movieId, Comment.CommentStatus.ACTIVE);
    }

    public void updateStatus(String id, Comment.CommentStatus status) {
        commentRepository.findById(id).ifPresent(comment -> {
            comment.setStatus(status);
            commentRepository.save(comment);
        });
    }

    public long countAllComments() {
        long count = commentRepository.count();
        log.debug("Total comments in database: {}", count);
        return count;
    }
} 