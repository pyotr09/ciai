package com.example.ciai.respositories;

import com.example.ciai.models.GoalAccountBalance;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "goalAccountBalances", path = "goalAccountBalances")
public interface GoalAccountBalanceRepository extends CrudRepository<GoalAccountBalance, Integer> {
}
