const jobManager = require('./jobManager');
const lowSlotTourJob = require('./jobs/lowSlotTourJob');

// Import more jobs here as needed

const initializeCronJobs = () => {
  // Register jobs
  jobManager.registerJob(
    lowSlotTourJob.name,
    lowSlotTourJob.schedule,
    lowSlotTourJob.task,
  );

  /* 
  jobManager.registerJob(
    jobList
  );
  */

  // Start all jobs
  jobManager.startAllJobs();
};

module.exports = initializeCronJobs;
