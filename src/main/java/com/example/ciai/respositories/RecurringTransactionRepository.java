package com.example.ciai.respositories;

import com.example.ciai.models.RecurringTransaction;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RecurringTransactionRepository extends CrudRepository<RecurringTransaction, Integer> {
    Iterable<RecurringTransaction> findAllByUserIdAndAccountId(String userId, Integer accountId);
    Iterable<RecurringTransaction> findAllByUserIdAndToAccountId(String userId, Integer toAccountId);
    List<RecurringTransaction> findByUserId(String userId);
}
