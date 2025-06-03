package com.cibook.bookingticket.mapper;

import com.cibook.bookingticket.dto.UserRegisterDto;
import com.cibook.bookingticket.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserRegisterMapper {
    User toEntity(UserRegisterDto userRegisterDto);
    UserRegisterDto toDto(User user);
}
