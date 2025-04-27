package com.cibook.bookingticket.mapper;

import com.cibook.bookingticket.dto.UserAuthDto;
import com.cibook.bookingticket.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserAuthMapper {
    User toEntity(UserAuthDto userAuthDto);
    UserAuthDto toDto(User user);
}
