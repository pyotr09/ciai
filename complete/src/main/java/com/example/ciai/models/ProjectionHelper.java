package com.example.ciai.models;

import com.example.ciai.respositories.AccountRepository;
import com.example.ciai.respositories.RecurringTransactionRepository;
import com.example.ciai.respositories.TransactionRepository;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProjectionHelper {

    private AccountRepository accountRepository;
    private TransactionRepository transactionRepository;
    private RecurringTransactionRepository recurringTransactionRepository;

    public ProjectionHelper(AccountRepository pAccRepo, TransactionRepository pTranRepo,
                            RecurringTransactionRepository pReccurRepo) {
        accountRepository = pAccRepo;
        transactionRepository = pTranRepo;
        recurringTransactionRepository = pReccurRepo;
    }

    public List<ProjectedAccountBalance> calculate(String userId, Date startDate, Date endDate) {
        List<ProjectedAccountBalance> results = new ArrayList<>();

        DateTime startDateTime = new DateTime(startDate);
        DateTime endDateTime = new DateTime(endDate);

        // get accounts for user
        Iterable<Account> accounts = accountRepository.findByUserId(userId);

        for (Account acc : accounts) {
            float balance = acc.getCurrentBalance();
            // sum transactions on account between dates
            Iterable<Transaction> transactions =
                    transactionRepository.findAllByUserIdAndAccountIdAndDateBetween(userId, acc.getId(),
                            startDate, endDate);
            for (Transaction tran : transactions) {
                balance += tran.getAmount();
            }

            Iterable<RecurringTransaction> recurringTransactions = recurringTransactionRepository
                    .findAllByUserIdAndAccountId(userId, acc.getId());
            for (RecurringTransaction rt : recurringTransactions) {
                DateTime rtStartDateTime = new DateTime(rt.getStartDate());
                DateTime rtEndDateTime = new DateTime(rt.getEndDate());
                int numOccurrences = 0;
                if (rt.getType().equals(RecurringType.INTERVAL_FREQUENCY)) {
                    if (startDateTime.isBefore(rtStartDateTime)) {
                        startDateTime = rtStartDateTime;
                    }
                    else {
                        Interval startingInterval = new Interval(rtStartDateTime, startDateTime);
                        long differenceBetweenStarts = startingInterval.toDuration().getStandardDays();
                        long daysUntilNextRecurrence = differenceBetweenStarts % rt.getDaysInterval();
                        startDateTime = startDateTime.plusDays((int)daysUntilNextRecurrence);
                    }

                    if (endDateTime.isAfter(rtEndDateTime)) {
                        endDateTime = rtEndDateTime;
                    }

                    Interval interval = new Interval(startDateTime, endDateTime);
                    numOccurrences = (int) interval.toDuration().getStandardDays() / rt.getDaysInterval();

                }
                else {

                }
                balance += Math.round((numOccurrences * rt.getAmount())*100.0)/100.0;
            }

            results.add(new ProjectedAccountBalance(endDate, acc, balance));
        }

        return results;
    }

}
