package com.example.ciai.respositories;

import com.example.ciai.models.Account;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

@RepositoryRestResource(collectionResourceRel = "accounts", path = "accounts")
public interface AccountRepository extends CrudRepository<Account, Integer> {
    List<Account> findByUserId(String userId);
    Account findByIdAndUserId(Integer id, String userId);
}
