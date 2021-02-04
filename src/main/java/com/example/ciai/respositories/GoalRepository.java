package com.example.ciai.respositories;

import com.example.ciai.models.Goal;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "goals", path = "goals")
public interface GoalRepository extends CrudRepository<Goal, Integer> {
    List<Goal> findByUserId(String userId);
}
