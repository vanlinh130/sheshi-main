import { exec } from 'child_process';
import { appLog } from '../config/winston';

export async function migrateDatabase() {
    try {
        await new Promise((resolve, reject) => {
            appLog.info('Migrating database...');
            exec(
            `npm run migrate`,
            { env: process.env },
            err => {
                if (err) {
                    appLog.error('Migration error', err);
                    return reject();
                }
                appLog.verbose('Database migration succeeded');
                return resolve();
            }
            );
        });

        return 'Database migration succeeded';
    } catch (e) {
        appLog.error('ERROR_MIGRATION_DB: ', e);
        throw e;
    }
}