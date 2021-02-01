package com.example.ciai.respositories;

import com.example.ciai.models.Transaction;
import org.springframework.data.repository.CrudRepository;

import java.util.Date;
import java.util.List;

public interface TransactionRepository extends CrudRepository<Transaction, Integer> {

    Iterable<Transaction> findAllByUserIdAndAccountIdAndDateBetween(String userId, Integer accountId,
                                                                    Date startDate, Date endDate);

    List<Transaction> findByUserId(String userId);
}
