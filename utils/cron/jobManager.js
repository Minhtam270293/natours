const cron = require('node-cron');

class JobManager {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Register a new cron job
   * @param {string} name - Unique name for the job
   * @param {string} schedule - Cron schedule expression
   * @param {Function} task - The task function to execute
   */
  registerJob(name, schedule, task) {
    if (this.jobs.has(name)) {
      throw new Error(`Job with name ${name} already exists`);
    }

    const job = cron.schedule(schedule, task, {
      scheduled: false,
    });

    this.jobs.set(name, job);
    return job;
  }

  /**
   * Start a specific job by name
   * @param {string} name - Name of the job to start
   */
  startJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.start();
    }
  }

  /**
   * Stop a specific job by name
   * @param {string} name - Name of the job to stop
   */
  stopJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
    }
  }

  /**
   * Start all registered jobs
   */
  startAllJobs() {
    for (const job of this.jobs.values()) {
      job.start();
    }
  }

  /**
   * Stop all registered jobs
   */
  stopAllJobs() {
    for (const job of this.jobs.values()) {
      job.stop();
    }
  }
}

module.exports = new JobManager();
