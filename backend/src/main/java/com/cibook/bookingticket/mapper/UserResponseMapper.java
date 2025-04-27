package com.cibook.bookingticket.mapper;

import com.cibook.bookingticket.dto.UserResponseDto;
import com.cibook.bookingticket.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserResponseMapper {
    User toEntity(UserResponseDto userResponseDto);
    UserResponseDto toDto(User user);
}
