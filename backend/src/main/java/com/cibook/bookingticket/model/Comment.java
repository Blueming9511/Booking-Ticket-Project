package com.cibook.bookingticket.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Builder
@Document(collection = "comments")
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Comment model representing user comments on movies")
public class Comment {
    @Id
    @Schema(description = "Unique identifier of the comment", example = "60b9b4a7e6c2f32b8c4d9a1e")
    private String id;
    
    @Schema(description = "ID of the user who made the comment", example = "60b9b4a7e6c2f32b8c4d9a1f", required = true)
    private String userId;
    
    @Schema(description = "Name of the user who made the comment", example = "John Doe")
    @Transient
    private String userName;
    
    @Schema(description = "ID of the movie being commented on", example = "60b9b4a7e6c2f32b8c4d9a2a", required = true)
    private String movieId;
    
    @Schema(description = "Content of the comment", example = "Great movie! Really enjoyed the plot.", required = true)
    private String content;
    
    @Builder.Default
    @Schema(description = "Flag indicating if the comment has been edited", example = "false")
    private boolean isEdited = false;
    
    @CreatedDate
    @Schema(description = "Timestamp when the comment was created", example = "2023-12-25T10:30:00")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Schema(description = "Timestamp when the comment was last updated", example = "2023-12-25T11:45:00")
    private LocalDateTime updatedAt;
    
    @Builder.Default
    @Schema(description = "Current status of the comment", example = "ACTIVE")
    private CommentStatus status = CommentStatus.ACTIVE;
    
    @Schema(description = "Possible status values for a comment")
    public enum CommentStatus {
        ACTIVE,
        HIDDEN,
        DELETED
    }
} 