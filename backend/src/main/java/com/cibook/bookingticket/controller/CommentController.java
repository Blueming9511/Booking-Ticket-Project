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

import java.util.List;
import java.util.Map;

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
    @PostMapping("/")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'ADMIN')")
    @Operation(summary = "Add a new comment", description = "Creates a new comment for a movie. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment created successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Comment.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Comment> add(
        @Parameter(description = "Comment object to be created", required = true, 
                  schema = @Schema(implementation = Comment.class))
        @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true,
            content = @Content(schema = @Schema(implementation = Comment.class)))
        @RequestBody Comment entity) {
        return ResponseEntity.ok(commentService.add(entity));
    }

    @Override
    @GetMapping("/")
    @Operation(summary = "Get all comments", description = "Returns a paginated list of all comments")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "400", description = "Invalid page or size parameter",
                    content = @Content(schema = @Schema()))
    })
    @Parameters({
        @Parameter(name = "page", description = "Page number (0-based)", required = false, 
                  schema = @Schema(type = "integer", defaultValue = "0")),
        @Parameter(name = "size", description = "Number of items per page", required = false,
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
            @Parameter(description = "Comment ID", required = true,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id) {
        return ResponseEntity.ok(commentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found")));
    }

    @Override
    @GetMapping("/names")
    @Operation(summary = "Get comment names", description = "Returns a map of comment IDs to names")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved comment names",
                content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = Map.class)))
    public ResponseEntity<Map<String, String>> getAllNames() {
        return ResponseEntity.ok(commentService.findAllNamesWithID());
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'ADMIN')")
    @Operation(summary = "Update a comment", description = "Updates an existing comment. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment updated successfully",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Comment.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Comment> update(
            @Parameter(description = "Comment ID", required = true,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id,
            @Parameter(description = "Updated comment object", required = true,
                      schema = @Schema(implementation = Comment.class))
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true,
                content = @Content(schema = @Schema(implementation = Comment.class)))
            @RequestBody Comment entity) {
        return ResponseEntity.ok(commentService.update(id, entity));
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'ADMIN')")
    @Operation(summary = "Delete a comment", description = "Deletes a comment by its ID. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment deleted successfully",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Comment ID", required = true,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id) {
        commentService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get comments by movie ID", 
              description = "Returns a paginated list of comments for a specific movie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "400", description = "Invalid page or size parameter",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Movie not found",
                    content = @Content(schema = @Schema()))
    })
    @Parameters({
        @Parameter(name = "movieId", description = "Movie ID", required = true, in = ParameterIn.PATH,
                  schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a2a")),
        @Parameter(name = "page", description = "Page number (0-based)", required = false,
                  schema = @Schema(type = "integer", defaultValue = "0")),
        @Parameter(name = "size", description = "Number of items per page", required = false,
                  schema = @Schema(type = "integer", defaultValue = "10"))
    })
    public ResponseEntity<Page<Comment>> getByMovieId(
            @PathVariable String movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.findByMovieId(movieId, PageRequest.of(page, size)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get comments by user ID", 
              description = "Returns a paginated list of comments by a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "400", description = "Invalid page or size parameter",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(schema = @Schema()))
    })
    @Parameters({
        @Parameter(name = "userId", description = "User ID", required = true, in = ParameterIn.PATH,
                  schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1f")),
        @Parameter(name = "page", description = "Page number (0-based)", required = false,
                  schema = @Schema(type = "integer", defaultValue = "0")),
        @Parameter(name = "size", description = "Number of items per page", required = false,
                  schema = @Schema(type = "integer", defaultValue = "10"))
    })
    public ResponseEntity<Page<Comment>> getByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.findByUserId(userId, PageRequest.of(page, size)));
    }

    @GetMapping("/movie/{movieId}/active")
    @Operation(summary = "Get active comments by movie ID", 
              description = "Returns a list of active comments for a specific movie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "404", description = "Movie not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<List<Comment>> getActiveCommentsByMovieId(
            @Parameter(description = "Movie ID", required = true,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a2a"))
            @PathVariable String movieId) {
        return ResponseEntity.ok(commentService.findActiveCommentsByMovieId(movieId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update comment status", 
              description = "Updates the status of a comment. Requires ADMIN role.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment status updated successfully",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "400", description = "Invalid status value",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content(schema = @Schema())),
        @ApiResponse(responseCode = "404", description = "Comment not found",
                    content = @Content(schema = @Schema()))
    })
    public ResponseEntity<Void> updateStatus(
            @Parameter(description = "Comment ID", required = true,
                      schema = @Schema(type = "string", example = "60b9b4a7e6c2f32b8c4d9a1e"))
            @PathVariable String id,
            @Parameter(description = "New status value (ACTIVE, HIDDEN, or DELETED)", required = true,
                      schema = @Schema(type = "object", example = "{\"status\": \"HIDDEN\"}"))
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true,
                content = @Content(schema = @Schema(type = "object",
                    example = "{\"status\": \"HIDDEN\"}")))
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Comment.CommentStatus newStatus = Comment.CommentStatus.valueOf(statusUpdate.get("status"));
            commentService.updateStatus(id, newStatus);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
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