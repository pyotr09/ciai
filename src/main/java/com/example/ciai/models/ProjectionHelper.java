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
            ProjectedAccountBalance result = new ProjectedAccountBalance();
            float balance = acc.getCurrentBalance();
            // sum transactions on account between dates
            Iterable<Transaction> transactions =
                    transactionRepository.findAllByUserIdAndAccountIdAndDateBetween(userId, acc.getId(),
                            startDate, endDate);
            balance += addTransactionsToResult(result, transactions, 1);

            // incoming transfers
            Iterable<Transaction> inTransfers =
                    transactionRepository.findAllByUserIdAndToAccountIdAndDateBetween(userId, acc.getId(),
                            startDate, endDate);
            balance += addTransactionsToResult(result, inTransfers, -1);


            // recurring transactions
            Iterable<RecurringTransaction> recurringTransactions = recurringTransactionRepository
                    .findAllByUserIdAndAccountId(userId, acc.getId());
            balance += addRecurringTransactionToResult(startDateTime, endDateTime, result, recurringTransactions, 1);

            // recurring in transfers
            Iterable<RecurringTransaction> recurringInTransfers = recurringTransactionRepository
                    .findAllByUserIdAndToAccountId(userId, acc.getId());
            balance += addRecurringTransactionToResult(startDateTime, endDateTime, result, recurringInTransfers, -1);

            result.setDate(endDate);
            result.setAccount(acc);
            result.setBalance(balance);
            results.add(result);
        }

        return results;
    }

    private float addRecurringTransactionToResult(DateTime startDateTime, DateTime endDateTime, ProjectedAccountBalance result, Iterable<RecurringTransaction> recurringTransactions, int multiplier) {
        float recurringTransactionsTotal = 0f;
        for (RecurringTransaction rt : recurringTransactions) {
            DateTime rtStartDateTime = new DateTime(rt.getStartDate());
            DateTime rtEndDateTime = new DateTime(rt.getEndDate());
            DateTime iterStartDate = startDateTime;
            DateTime iterEndDate = endDateTime;
            if (rt.getType().equals(RecurringType.INTERVAL_FREQUENCY)) {
                if (iterStartDate.isBefore(rtStartDateTime)) {
                    iterStartDate = rtStartDateTime;
                }
                else {
                    Interval startingInterval = new Interval(rtStartDateTime, iterStartDate);
                    long differenceBetweenStarts = startingInterval.toDuration().getStandardDays();
                    long daysUntilNextRecurrence = differenceBetweenStarts % rt.getDaysInterval();
                    iterStartDate = iterStartDate.plusDays((int)daysUntilNextRecurrence);
                }

                if (iterEndDate.isAfter(rtEndDateTime)) {
                    iterEndDate = rtEndDateTime;
                }

                DateTime transDate = iterStartDate;
                while (transDate.isBefore(iterEndDate.plusDays(1))) {
                    result.addTransaction(new ProjectionTransaction(multiplier * rt.getAmount(), transDate.toDate(), rt.getDescription()));
                    recurringTransactionsTotal+= multiplier * rt.getAmount();
                    transDate = transDate.plusDays(rt.getDaysInterval());
                }

            }
            else {
                DateTime iterDate = iterStartDate;
                while (iterDate.isBefore(iterEndDate.plusMonths(1))) {
                    DateTime transDate = new DateTime(iterDate.getYear(), iterDate.getMonthOfYear(), rt.getDayOfMonth(), 0, 0);
                    if (transDate.isAfter(iterStartDate) && transDate.isAfter(rtStartDateTime.minusDays(1))
                        && transDate.isBefore(iterEndDate.plusDays(1)) && transDate.isBefore(rtEndDateTime.plusDays(1))) {
                        result.addTransaction(new ProjectionTransaction(multiplier * rt.getAmount(), transDate.toDate(), rt.getDescription()));
                        recurringTransactionsTotal += multiplier * rt.getAmount();
                    }
                    iterDate = iterDate.plusMonths(1);
                }
            }
        }
        return recurringTransactionsTotal;
    }

    private float addTransactionsToResult(ProjectedAccountBalance result, Iterable<Transaction> transactions, int multiplier) {
        float transactionsTotal = 0.00f;
        for (Transaction tran : transactions) {
            transactionsTotal += multiplier * tran.getAmount();
            result.addTransaction(
                    new ProjectionTransaction(multiplier * tran.getAmount(), tran.getDate(), tran.getDescription()));
        }
        return transactionsTotal;
    }

}
