package com.example.files.utils;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.util.ListUtils;
import com.example.files.entity.User;
import com.example.files.service.UserService;

import java.util.List;

/**
 * Reads rows from the imported Excel file and writes the valid ones to the database.
 *
 * <p>A row is skipped when the name or the mobile phone is blank, because both
 * columns are mandatory in the database schema. Invalid rows do not abort the
 * whole import: the listener keeps counting and the caller receives a summary
 * of imported / skipped rows.</p>
 */
public class UserListener extends AnalysisEventListener<User> {

    private static final int BATCH_SIZE = 100;

    private final UserService userService;

    private final List<User> users = ListUtils.newArrayList();

    private int successCount;

    private int skippedCount;

    public UserListener(UserService userService) {
        this.userService = userService;
    }

    /**
     * Clears the counters before a new import starts. The listener is a Spring
     * singleton bean, therefore it is reused across requests.
     */
    public void reset() {
        users.clear();
        successCount = 0;
        skippedCount = 0;
    }

    @Override
    public void invoke(User user, AnalysisContext context) {
        if (user == null || isBlank(user.getUsername()) || isBlank(user.getPhone())) {
            skippedCount++;
            return;
        }
        if (user.getCollect() == null) {
            user.setCollect(1);
        }
        users.add(user);
        if (users.size() >= BATCH_SIZE) {
            saveUsersToDatabase();
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        saveUsersToDatabase();
    }

    private void saveUsersToDatabase() {
        if (users.isEmpty()) {
            return;
        }
        userService.saveBatch(users);
        successCount += users.size();
        users.clear();
    }

    public int getSuccessCount() {
        return successCount;
    }

    public int getSkippedCount() {
        return skippedCount;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
