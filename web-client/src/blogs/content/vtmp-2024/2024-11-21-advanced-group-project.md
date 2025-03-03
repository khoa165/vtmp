---
title: How did we go beyond CRUD in a personal project?
authors: Hoang Nguyen
contributors: Ha Linh, Khanh Linh, Huu Khang
description: Hello everyone, I’m Hoang, a mentee of the Viet Tech Mentorship Program (cohort 2024). This past summer, my team worked on a project called Cupid. Initially, we struggled to figure out how to make Cupid more than just a basic web app. Thanks to the dedicated guidance from our project advisors — Khoa Le and Nick Doan — we were able to elevate Cupid to the next level.
date: 11-21-2024
tags: reflection, technical
banner: https://res.cloudinary.com/khoa165/image/upload/v1740992775/viettech/cupid.jpg
---

## Motivation

In the past, I had completed several projects, but many of them barely scratched the surface of the basics or weren't impressive enough to put on my resume. This lack of depth makes my resume often don't make it through the any resume round. This was a significant pain point for me. However, by the end of the Cupid project, we had built something that received positive reactions from recruiters and engineers within the interviews who showed interest in our work. While this doesn't guarantee that every resume will pass through screenings, it was a huge improvement that demonstrated our growth. That’s why we wanted to share our experience of working on Cupid.

For me, a "basic" project could be a CRUD app or something easily built using available online resources. To break this threshold and make a project “impressive,” I realized I needed to work on something more challenging—a project involving technical problems that are not easily solved through a simple search and that require critical decision-making. This includes integrating multiple APIs and services for unique features that enhance the app beyond what’s typical.

## Background

Our focus for Cupid was to implement a cloud service architecture capable of handling our target number of users while maintaining cost efficiency. In this post, I’ll walk you through our journey of building a cloud architecture—starting from zero experience in cloud services and system design—and how this process made our project stand out. This guide aims to be a helpful reference for anyone wanting to elevate your project. If you’re not yet familiar with building a basic web app, I recommend starting with a beginner-friendly guide from my beloved mentor Hieu Vuong

Target Audience: Those who already know how to create a basic web app but are looking to elevate it. No prior experience in cloud services or system design is required, but a willingness to learn and do research is essential.

Disclaimer: This architecture was developed by a team of sophomore and junior Computer Science students with no prior experience in cloud services or system design. It was created through extensive research and critical thinking, and there may still be mistakes or non-optimal solutions. We’d highly appreciate any contributions or suggestions to help improve our architecture.

## Project Context

Cupid is a platform that streamlines the referral process for job seekers by directly connecting them with employees willing to provide referrals. By matching job seekers with the right referral givers, Cupid makes the referral process more accessible and efficient.

To keep things simple, I'll focus on the high-level aspects of the app and leave out detailed features or implementations. Essentially, Cupid collects referral requests from job seekers and available referral opportunities from company employees, then matches them based on a set of criteria.

Before diving into the development journey, I want to share a few key questions that guided our system-level decisions. From the start, we approached this project with the mindset of building it for real users and the community, which led me to ask the following questions to make informed architectural choices:

- Should this feature be split into a separate service?
  This means considering whether a specific feature or functionality should have its own dedicated codebase and be deployed as an independent service. Ensures modularity, easier scaling, and better maintainability.
- Which cloud service best fits our needs?
  Helps select the most efficient and cost-effective tools for implementation.
- How will it handle a high volume of requests?
  Ensures scalability to manage peak loads and maintain performance.

So let's get into the development phase. We will break down the architecture into components/services and go through each component in order of development. Each stage/component we already mark its number in the picture, you can reference to the picture along with your reading.

### Stage 1: main api call component

All basic app will start with some basic API for CRUD operation. Ok, now let’s go through all my questions to decide how we can bring this into production.

1. Should we split it into separate service?

Yeah, sure, this should be the main component of the application where it handle most of basic request from users. So I assigned this component as a main user request handler which is dedicated to handle all request from users.

2. Which cloud service best fits our needs?

Initially we plan to go with most popular and well-known solution named AWS EC2 (which basically you buy a virtual computer and put your code on that computer, it will run 24/7 waiting for a request from the user, instead of running on your local machine and shutting down when you turn down your computer). However, after receiving valuable advice from Nick Doan, I considered another option: AWS Lambda. AWS Lambda also runs on a virtual machine but operates on-demand, only when it receives a request, rather than running continuously.

Let’s dive a bit deeper. EC2 would work well for our case, but do we really need a machine running 24/7 for an API server? Probably not. During periods of low activity, we would still need to pay for EC2, even when no requests are being made. On the other hand, AWS Lambda runs only when there are requests and is billed based on the total time of execution, making it a more cost-effective option for our needs. While there are additional reasons why Lambda might be more suitable, this cost-efficiency was a major deciding factor.

3. How will it handle a high volume of requests?

Can AWS Lambda handle a significant number of simultaneous requests? Yes, it can. Lambda automatically scales with demand, supporting up to 1,000 concurrent requests, which is far beyond our expected usage. This scalability makes AWS Lambda an efficient choice for handling the component's purpose.

After conducting thorough research and considering all relevant factors, we chose to implement AWS Lambda as the primary server for handling user requests.

### Stage 2: Matching algorithm

Since Cupid needs to match referral requests with referral openings, the matching process requires quite a bit of computation—it needs to evaluate and prioritize each request over others. We run this algorithm once a week to ensure we gather a sufficient amount of requests and openings before matching. So, I already have the code for this, but the next question is—how do we integrate it into the architecture?

1. Should we split it into a separate service?

Absolutely. The matching algorithm has a very specific role compared to the main API, and it also involves substantial computation. Plus, unlike other user-triggered features, this runs automatically on a schedule. By separating it into its own service, we get several benefits—better modularity, independent scalability to handle heavier computational loads, and overall better system resilience. Now, let’s figure out which cloud service best fits our needs.

2. Which cloud service best fits our needs and how if it’s going large?

Let’s look at what we need here: (1) This only runs once a week, so we need something that charges only when it runs, and (2) we need it to handle substantial computation. With that in mind, AWS Lambda immediately comes to mind—it runs on demand and charges only when it executes. Now, Lambda does have some limitations when it comes to handling very intense computation. That said, for where we are right now—early stages of the project, with only a handful of calculations—it’s perfect. Lambda can definitely handle what we’re doing at the moment.

Note: But—yes, there's a "but"—if our app grows much larger, we’ll need to consider alternatives that can handle more intense computations. Something similar to Lambda but without the same limits. Since we're aiming to keep things simple and beginner-friendly for now, Lambda makes sense.

So another question is how do we schedule this thing? The answer is quite simple after 1 search, it’s AWS EventBridge which can create an event on schedule to trigger the function in lambda.

And… yeah. Now we have a separate component that automatically run the matching algorithm once a week, with the most optimal solution we could made of.

### Stage 3: Notification System

We started thinking about how to send notifications to users and update the UI in real-time. This feature ended up being more complicated than we initially thought. But hey, let me walk you through how we designed it at a high level.

1. Should we split it into a separate service?

Yes, once again. The notification system has a completely different role compared to the other parts of the app—it’s just for receiving notification requests and sending those notifications to users (via email and updating the UI in real time). Plus, I wanted to keep the notification data in a separate database.

2. How did we build it?

So, the basic requirements for this service are straightforward: Whenever a notification comes in, it should get sent to this system, which will take care of sending an email and updating the UI in real time. For this, we decided to use AWS Lambda again since it deals with low-volume requests and processes them easily.

Initial thought: We could just have one Lambda to handle incoming requests and send notifications immediately. Easy, right?

Reality: But what happens if we get a lot of notifications? One Lambda can only handle around 1000 requests at a time, and if we get more than that, it’ll struggle. So, we needed to find a solution.

How can we solve this? After some research, we found the concept of a Message Queue. Let me simplify it: Imagine a store is overcrowded. If all the customers rush in at once, the staff will get overwhelmed. Instead, customers should line up and wait their turn, right? This is exactly how a notification queue works. When there are too many notification messages to process, they need to "line up" and wait until it’s their turn. A message queue helps us do exactly that. It keeps messages in order and processes them one by one, ensuring that the Lambda doesn’t get overloaded.

Which queue service did we use? Great, we knew a queue was our solution, but we still needed to decide on the service to implement it. There are a few options out there (like Kafka or RabbitMQ), but those felt a bit too advanced. Fortunately, AWS has its own queuing service called AWS SQS. It’s super easy to implement and fits perfectly with the AWS ecosystem we're using.

(Quick note: When working with a queue, make sure all computing-heavy tasks happen after queuing. This ensures they wait their turn—just like customers waiting in line before they get served.)

## The final design:

Cool! After knowing all the service and design you should design, now just make a final design to make it work!

1. First Lambda:

This acts as the interface for the notification component, meaning any other system that wants to communicate with the notification service will go through this Lambda. Its main role is to handle incoming notification requests, perform any necessary initial setup or preprocessing, and then forward the messages to the queue for further handling.

2. AWS SQS:

All notification messages/requests from first Lambda go into the queue, which slowly hands them off to a second Lambda, kind of like saying, "Alright, I’m ready for the next job" after finishing each one.

3. Second Lambda (the “worker”):

This is where the real work happens. The worker does the heavy lifting, like (1) sending emails to users via AWS SES and (2) creating new notifications in Firebase, which get updated in real time in the UI.

## Wrap up

Done! We've successfully built a simple, efficient, and scalable notification system for Cupid. To wrap up, I'd like to highlight a couple of key points to consider when showcasing this project on your resume and during interviews:

1. Tackle Real-World Problems:

Projects become more meaningful when they're motivated by real-life challenges. Working on something that addresses an actual need makes the process more rewarding and the outcome more impactful.

2. Focus on Engaging Technical Challenges:

It’s fine to use a popular tech stack like MERN, but make sure the technical challenges you tackle are interesting. For instance, work on complex features that require integrating multiple APIs and present them as your own unique solution to a real-world problem. Or, like we did, focus on designing a product meant to serve real users while ensuring the system is efficient and scalable.

3. Focus on the tradeoffs you make:

It’s essential to understand why you chose "A" instead of "B." There could be scenarios where "B" might actually be better, but you selected "A" because it fits better for your specific case. Be clear about these decisions—you should be ready to answer "Tell me about a tradeoff you made in your project?" in behavioral interviews or any technical discussions.

4. Outline the steps to your final solution:
   Not only should you be clear about the tradeoffs you made, but also about the process of arriving at the solution. For example, you might research option A, consult advisors, discuss with teammates, explore alternative B, then weigh the tradeoffs specifically for your case, eventually leading to a decision that C is the best fit. Interviewers appreciate hearing about this "journey" to a solution because it shows critical thinking, decision-making, and collaboration.

Documenting this journey will be incredibly helpful for your behavioral interviews with engineers, so I highly recommend keeping a journal to capture these experiences.

This is quite a long post, so I truly appreciate your time in reading through it. As always, your feedback is more than welcome—it's through feedback that we grow and improve. Wishing you all an amazing hacking journey ahead!

Acknowledgement: I want to take a moment to give a big shout out to my teammates—Ha Linh, Khanh Linh, and Huu Khang—for being an incredible part of this journey. I also want to thank Ngoc Anh, our amazing UI/UX designer, who contributed significantly even though she wasn’t officially part of the team. This project wouldn’t have come this far without the dedicated support from our advisors: Khoa Le and Nick Doan.
