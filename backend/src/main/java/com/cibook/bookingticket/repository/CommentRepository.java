package com.cibook.bookingticket.repository;

import com.cibook.bookingticket.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    Page<Comment> findByMovieId(String movieId, Pageable pageable);
    Page<Comment> findByUserId(String userId, Pageable pageable);
    List<Comment> findByMovieIdAndStatus(String movieId, Comment.CommentStatus status);
} 