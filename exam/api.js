import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interaction with the API will be stored here.
  static token;
  static AUTH_ROUTE = 'auth';
  static COMPANIES_ROUTE = 'companies';
  static JOBS_ROUTE = 'jobs';
  static USERS_ROUTE = 'users';

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      const message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /* AUTH ROUTES *************************************************************/
  
  /**
   * Authenticate user and return token.
   * Auth required: none
   * 
   * @param {Object} userCredentials { username, password }
   * @returns token
   */
  static async authenticate(userCredentials) {
    const res = await JoblyApi.request(`${JoblyApi.AUTH_ROUTE}/token`, 
                                  userCredentials,
                                  "post");
    return res.token;
  }

  /**
   * Create user account and return token.
   * Auth required: none
   * 
   * @param {Object} userData 
   * @returns token
   */
  static async register(userData) {
    const res = await JoblyApi.request(`${JoblyApi.AUTH_ROUTE}/register`, 
                                  userData,
                                  "post");
    return res.token;
  }
  // end auth routes

  /* COMPANIES ROUTES *************************************************************/
  
  /**
   * Add a company to the db.
   * Auth required: admin
   * 
   * @param {Object} companyData { handle, name, description, numEmployees, logoUrl }
   * @returns company: { handle, name, description, numEmployees, logoUrl }
   */
  static async addCompany(companyData) {
    const res = await JoblyApi.request(`${JoblyApi.COMPANIES_ROUTE}`,
                                   companyData,
                                   "post");
    return res.company;
  }

  /**
   * Get the list of companies.
   * Auth required: none
   * 
   *  Can provide search filter in query:
   * - minEmployees
   * - maxEmployees
   * - name (will find case-insensitive, partial matches)
   * 
   * @param {Object} searchCriteria { minEmployees, maxEmployees, name }
   * @returns companies: [ { handle, name, description, numEmployees, logoUrl }, ...]
   */
   static async getCompanyList(searchCriteria={}) {
    const res = await JoblyApi.request(`${JoblyApi.COMPANIES_ROUTE}`, searchCriteria);
    return res.companies;
  }

  /**
   * Get details on a company given its handle.
   * Auth required: none
   * 
   * @param {string} handle  
   * @returns company: { handle, name, description, numEmployees, logoUrl, jobs } 
   *          where jobs is [{ id, title, salary, equity }, ...]
   */
  static async getCompany(handle) {
    const res = await JoblyApi.request(`${JoblyApi.COMPANIES_ROUTE}/${handle}`);
    return res.company;
  }

  /**
   * Update company data.
   * Auth required: admin
   * 
   * @param {string} handle - company handle
   * @param {Object} updatedData - data can include: { name, description, numEmployees, logo_url }
   * @returns company: { handle, name, description, numEmployees, logo_url }
   */
  static async updateCompany(handle, updatedData) {
    const res = await JoblyApi.request(`${JoblyApi.COMPANIES_ROUTE}/${handle}`,
                                   updatedData,
                                   "patch");
    return res.company;
  }

  /**
   * Delete a company by handle. 
   * Auth required: admin
   * 
   * @param {string} handle - company handle
   * @returns company handle
   */
  static async deleteCompany(handle) {
    const res = await JoblyApi.request(`${JoblyApi.COMPANIES_ROUTE}/${handle}`,
                                   {},
                                   "delete");
    return res.deleted;
  }
  // end company routes
  
  /* JOBS ROUTES *************************************************************/

  /**
   * Add a new job to the db.
   * Auth required: admin
   * 
   * @param {Object} jobData { title, salary, equity, companyHandle }
   * @returns job: { id, title, salary, equity, companyHandle }
   */
  static async addJob(jobData) {
    const res = await JoblyApi.request(`${JoblyApi.JOBS_ROUTE}`,
                                   jobData,
                                   "post");
    return res.job;
  }

  /**
   * Get a list of jobs. 
   * Auth required: none
   * 
   *  Can provide search filter in query:
   * - minSalary
   * - hasEquity (true returns only jobs with equity > 0, other values ignored)
   * - title (will find case-insensitive, partial matches)
   * 
   * @param {Object} searchCriteria { minSalary, hasEquity, title }
   * @returns jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...]
   */
  static async getJobList(searchCriteria={}) {
    const res = await JoblyApi.request(`${JoblyApi.JOBS_ROUTE}`, searchCriteria);
    return res.jobs;
  }

  /**
   * Get details on a company by job id.
   * Auth required: none
   * 
   * @param {number} id - job id
   * @returns job: { id, title, salary, equity, company }
   *          where company is { handle, name, description, numEmployees, logoUrl }
   */
  static async getJob(id) {
    const res = await JoblyApi.request(`${JoblyApi.JOBS_ROUTE}/${id}`);
    return res.job;
  }

  /**
   * Update a job by id.
   * Auth required: admin
   * 
   * @param {number} id - job id
   * @param {Object} updatedData - data can include: { title, salary, equity }
   * @returns job: { id, title, salary, equity, companyHandle }
   */
  static async updateJob(id, updatedData) {
    const res = await JoblyApi.request(`${JoblyApi.JOBS_ROUTE}/${id}`,
                                   updatedData, 
                                   "patch");
    return res.job;
  }

  /**
   * Delete a job given its id.
   * Auth required: admin
   * 
   * @param {number} id - job id
   * @returns job id
   */
  static async deleteJob(id) {
    const res = await JoblyApi.request(`${JoblyApi.JOBS_ROUTE}/${id}`, {}, "delete");
    return res.deleted;
  }
  // end jobs routes

  /* USERS ROUTES *************************************************************/

  /**
   * Allows admin to add a new user.
   * Auth required: admin
   * 
   * @param {Object} userData 
   * @returns {user: { username, firstName, lastName, email, isAdmin }, token }
   */
  static async addUser(userData) {
    const res = await JoblyApi.request(`${JoblyApi.USERS_ROUTE}`,
                                   userData,
                                   "post");
    return res;
  }

  /**
   * Gets a list of users.
   * Auth required: admin
   * 
   * @returns users: [ {username, firstName, lastName, email }, ... ]
   */
  static async getUserList() {
    const res = await JoblyApi.request(`${JoblyApi.USERS_ROUTE}`);
    return res.users;
  }

  /**
   * Get user details by username.
   * Auth required: admin or same user-as-:username
   * 
   * @param {string} username 
   * @returns user: { username, firstName, lastName, isAdmin, applications, email }
   *          where applications is [job1_id, job2_id, ...]
   */
  static async getUser(username) {
    const res = await JoblyApi.request(`${JoblyApi.USERS_ROUTE}/${username}`);
    return res.user;
  }

  /**
   * Update a user given a username.
   * Auth required: admin or same user-as-:username
   * 
   * @param {string} username 
   * @param {Object} updatedData - data can include: { firstName, lastName, password, email }
   * @returns user: { username, firstName, lastName, email, isAdmin }
   */
  static async updateUser(username, updatedData) {
    const res = await JoblyApi.request(`${JoblyApi.USERS_ROUTE}/${username}`,
                                   updatedData,
                                   "patch");
    return res.user;
  }

  /**
   * Delete a user by username.
   * Auth required: admin or same-user-as-:username
   * 
   * @param {string} username 
   * @returns username
   */
  static async deleteUser(username) {
    const res = await JoblyApi.request(`${JoblyApi.USERS_ROUTE}/${username}`,
                                   {},
                                   "delete");
    return res.deleted;
  }

  /**
   * Apply a user for a given job. 
   * Auth required: admin or same-user-as-:username
   * 
   * @param {string} username 
   * @param {number} jobId 
   * @returns jobId
   */
  static async applyForJob(username, jobId) {
    const res = await JoblyApi.request(`${JoblyApi.USERS_ROUTE}/${username}/jobs/${jobId}`,
                                   {},
                                   "post");
    return res.applied;
  }
}

export default JoblyApi;