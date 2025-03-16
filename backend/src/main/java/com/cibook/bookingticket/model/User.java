package com.cibook.bookingticket.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Collection;

@Data
@Document (collection = "users")
public class
User {
    @Id
    private String UserID;
    private String Username;
    private String email;
    private String password;
    private String avatar;
    private String role;

}
