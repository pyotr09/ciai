package com.example.ciai;

import com.example.ciai.models.*;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Component
public class RestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(User.class);
        config.exposeIdsFor(Account.class);
        config.exposeIdsFor(Transaction.class);
        config.exposeIdsFor(RecurringTransaction.class);
        config.exposeIdsFor(Goal.class);
        config.exposeIdsFor(GoalAccountBalance.class);
    }

}
