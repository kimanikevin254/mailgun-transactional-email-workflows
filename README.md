# Building Transactional Email Workflows for Shipping Notifications with Mailgun’s API

This repository demonstrates how to build a transactional email workflow for shipping notifications using [Mailgun’s](https://www.mailgun.com/) API. The workflow integrates [BullMQ](https://docs.bullmq.io/), a powerful job queue system that processes email notifications separately from the main application logic. This improves scalability and ensures that email sending does not slow down the system, especially in high-traffic applications.

Here is a rough architecture diagram of the workflow:

![A rough architecture diagram of the system](https://i.imgur.com/TLslvbH.png)

## How the process works:

1. The shipping team (or any relevant system) sends an HTTP request to update an order’s status.
2. The Express server updates the order status in the SQLite database and adds a job to the BullMQ queue.
3. A BullMQ worker processes jobs from the queue and uses the Mailgun API to send an email to the customer.
4. The worker automatically retries failed jobs.
5. Mailgun delivers the email to the customer.

## Running the Project Locally

To run this project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/kimanikevin254/mailgun-transactional-email-workflows.git

    cd mailgun-transactional-email-workflows
    ```

2. Install dependencies:

    ```bash


    npm i
    ```

3. Configure Mailgun:

    - Obtain your sandbox domain and API key from the [Mailgun dashboard](https://app.mailgun.com).
    - Set up [authorized recipients](https://help.mailgun.com/hc/en-us/articles/217531258-Authorized-Recipients) for your domain.

4. Set up the database:

    - Open `src/database/seed.ts` and update the placeholder values in the `userInfo` object with the actual values

5. Configure environment variables:

    - Rename `.env.example` to `.env`
    - Replace the placeholder values with the actual credentials.

6. Start Redis in Docker:

    ```bash
    docker compose up -d
    ```

7. Start the Express server:

    ```bash
    npm run dev
    ```

8. Test the Workflow

    - Open `http://localhost:3000` in your browser.
    - Update the order status in the dashboard.
    - The seeded user should receive an order status update via email.
