package com.cibook.bookingticket.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IService<T, K> {

    T add(T entity);

    Optional<T> findById(K id);
    Optional<T> findByCode(K id);
    List<T> findAll();
    Map<K, K> findAllNamesWithID();

    T update(K id, T entity);

    void deleteById(K id);

    boolean existsById(K id);

}