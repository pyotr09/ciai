package com.example.ciai.respositories;

import com.example.ciai.models.RecurringTransaction;
import org.springframework.data.repository.CrudRepository;

public interface RecurringTransactionRepository extends CrudRepository<RecurringTransaction, Integer> {
    Iterable<RecurringTransaction> findAllByUserIdAndAccountId(String userId, Integer accountId);
}
