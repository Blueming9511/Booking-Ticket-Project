package com.cibook.bookingticket.controller;

import com.cibook.bookingticket.model.Comment;
import com.cibook.bookingticket.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

// Define a simple DTO for status update for better type safety and clarity
class CommentStatusUpdateRequest {
    private Comment.CommentStatus status;

    public Comment.CommentStatus getStatus() {
        return status;
    }

    public void setStatus(Comment.CommentStatus status) {
        this.status = status;
    }
}

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comments", description = "Comment management APIs")
public class CommentController implements IController<Comment, String> {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @Override
    @PostMapping("") // Changed from "/"
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'ADMIN')")
    @Operation(summary = "Add a new comment",
               description = "Creates a new comment for a movie. Requires authentication.",
               requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                   description = "Comment object to be created",
                   required = true,
                   content = @Content(schema = @Schema(implementation = Comment.class))
               ))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment created successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Comment.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Comment> add(@RequestBody Comment entity) {
        return ResponseEntity.ok(commentService.add(entity));
    }

    @Override
    @GetMapping("") // Changed from "/"
    @Operation(summary = "Get all comments", description = "Returns a paginated list of all comments")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))), // Assuming Page<Comment> is the structure
        @ApiResponse(responseCode = "400", description = "Invalid page or size parameter",
                    content = @Content(schema = @Schema()))
    })
    @Parameters({ // Grouping parameters for the operation
        @Parameter(name = "page", description = "Page number (0-based)", required = false, in = ParameterIn.QUERY,
                  schema = @Schema(type = "integer", defaultValue = "0")),
        @Parameter(name = "size", description = "Number of items per page", required = false, in = ParameterIn.QUERY,
                  schema = @Schema(type = "integer", defaultValue = "10"))
    })
    public ResponseEntity<Page<Comment>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.findAll(PageRequest.of(page, size)));
    }

    @Override
    @GetMapping("/{id}")
    @Operation(summary = "Get comment by ID", description = "Returns a single comment by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comment",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Comment.class))),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Comment> getById(
            @Parameter(name = "id", description = "Comment ID", required = true, in = ParameterIn.PATH,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id) {
        // Consider using a custom ResourceNotFoundException mapped to 404
        return ResponseEntity.ok(commentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id)));
    }

    @Override
    @GetMapping("/names")
    @Operation(summary = "Get comment names", description = "Returns a map of comment IDs to a representative string (e.g., commenter name or partial text).")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved comment names",
                content = @Content(mediaType = "application/json",
                schema = @Schema(type = "object", additionalProperties = Schema.AdditionalPropertiesValue.TRUE))) // More generic map schema
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(commentService.findAllNamesWithID());
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'ADMIN')") // Consider more granular auth (e.g., owner or admin)
    @Operation(summary = "Update a comment",
               description = "Updates an existing comment. Requires authentication. Users may only update their own comments unless they are Admins.",
               requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                   description = "Updated comment object",
                   required = true,
                   content = @Content(schema = @Schema(implementation = Comment.class))
               ))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment updated successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Comment.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Comment> update(
            @Parameter(name = "id", description = "Comment ID", required = true, in = ParameterIn.PATH,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id,
            @RequestBody Comment entity) {
        return ResponseEntity.ok(commentService.update(id, entity));
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'ADMIN')") // Consider more granular auth (e.g., owner or admin)
    @Operation(summary = "Delete a comment", description = "Deletes a comment by its ID. Requires authentication. Users may only delete their own comments unless they are Admins.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment deleted successfully"), // Content usually empty for 200 on DELETE
        @ApiResponse(responseCode = "204", description = "Comment deleted successfully (No Content)"), // Alternative success
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Void> delete(
            @Parameter(name = "id", description = "Comment ID", required = true, in = ParameterIn.PATH,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id) {
        commentService.deleteById(id);
        return ResponseEntity.ok().build(); // or ResponseEntity.noContent().build(); for 204
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get comments by movie ID",
              description = "Returns a paginated list of comments for a specific movie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))), // Assuming Page<Comment>
        @ApiResponse(responseCode = "400", description = "Invalid page or size parameter",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Movie not found",
                    content = @Content(schema = @Schema()))
    })
    @Parameters({
        @Parameter(name = "movieId", description = "Movie ID", required = true, in = ParameterIn.PATH,
                  schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a2a")),
        @Parameter(name = "page", description = "Page number (0-based)", required = false, in = ParameterIn.QUERY,
                  schema = @Schema(type = "integer", defaultValue = "0")),
        @Parameter(name = "size", description = "Number of items per page", required = false, in = ParameterIn.QUERY,
                  schema = @Schema(type = "integer", defaultValue = "10"))
    })
    public ResponseEntity<Page<Comment>> getByMovieId(
            @PathVariable String movieId, // Name matches "movieId" in @Parameter
            @RequestParam(defaultValue = "0") int page, // Name matches "page" in @Parameter
            @RequestParam(defaultValue = "10") int size) { // Name matches "size" in @Parameter
        return ResponseEntity.ok(commentService.findByMovieId(movieId, PageRequest.of(page, size)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get comments by user ID",
              description = "Returns a paginated list of comments by a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))), // Assuming Page<Comment>
        @ApiResponse(responseCode = "400", description = "Invalid page or size parameter",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(schema = @Schema()))
    })
    @Parameters({
        @Parameter(name = "userId", description = "User ID", required = true, in = ParameterIn.PATH,
                  schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1f")),
        @Parameter(name = "page", description = "Page number (0-based)", required = false, in = ParameterIn.QUERY,
                  schema = @Schema(type = "integer", defaultValue = "0")),
        @Parameter(name = "size", description = "Number of items per page", required = false, in = ParameterIn.QUERY,
                  schema = @Schema(type = "integer", defaultValue = "10"))
    })
    public ResponseEntity<Page<Comment>> getByUserId(
            @PathVariable String userId, // Name matches "userId" in @Parameter
            @RequestParam(defaultValue = "0") int page, // Name matches "page" in @Parameter
            @RequestParam(defaultValue = "10") int size) { // Name matches "size" in @Parameter
        return ResponseEntity.ok(commentService.findByUserId(userId, PageRequest.of(page, size)));
    }

    @GetMapping("/movie/{movieId}/active")
    @Operation(summary = "Get active comments by movie ID",
              description = "Returns a list of active comments for a specific movie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = List.class))), // Assuming List<Comment>
        @ApiResponse(responseCode = "404", description = "Movie not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<List<Comment>> getActiveCommentsByMovieId(
            @Parameter(name = "movieId", description = "Movie ID", required = true, in = ParameterIn.PATH,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a2a"))
            @PathVariable String movieId) {
        return ResponseEntity.ok(commentService.findActiveCommentsByMovieId(movieId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update comment status",
              description = "Updates the status of a comment (e.g., ACTIVE, HIDDEN). Requires ADMIN role.",
              requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                  description = "New status value. The 'status' field should be one of: ACTIVE, HIDDEN, DELETED.",
                  required = true,
                  content = @Content(schema = @Schema(implementation = CommentStatusUpdateRequest.class))
              ))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment status updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid status value or request format",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Void> updateStatus(
            @Parameter(name = "id", description = "Comment ID", required = true, in = ParameterIn.PATH,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id,
            @RequestBody CommentStatusUpdateRequest statusRequest) {
        // Spring's Jackson deserializer will handle enum conversion.
        // If statusRequest.getStatus() is null or invalid, a 400 Bad Request will likely be returned automatically
        // or you can add explicit validation.
        if (statusRequest == null || statusRequest.getStatus() == null) {
            return ResponseEntity.badRequest().build(); // Or a more descriptive error
        }
        commentService.updateStatus(id, statusRequest.getStatus());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    @Operation(summary = "Get total comment count",
              description = "Returns the total number of comments in the database")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved comment count",
                content = @Content(mediaType = "application/json",
                schema = @Schema(type = "integer", format = "int64")))
    public ResponseEntity<Long> getCommentCount() {
        return ResponseEntity.ok(commentService.countAllComments());
    }
}