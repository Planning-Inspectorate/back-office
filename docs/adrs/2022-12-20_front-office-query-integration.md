# Repository Structure

- Status: Proposed
- Deciders: Engineering Leadership
- Date: 2022-12-20

## **Context and Problem Statement**

The Front Office will need to be able to consume the following data owned by the back office:

- NSIP Applications
- Exam Timetables
- Interested Parties
- Documents
- Representations

There are many options for integrating the two applications, and the assumption so far has been that the front office will also consume the data published to service bus for the ODW. A more detailed background on the options is [https://pins-ds.atlassian.net/wiki/spaces/BO/pages/1090256897/Back-Office+Front-Office+Integration](documented on Confluence).

## **Decision Drivers**

- Integrating the applications in a timely manner
- Adhering to long-term architectural goals of PINS
- Providing enough autonomy as possible for both applications

## **Considered Options**

- Direct database integration
- API Integration
- API Integration with Caching & Notifications
- Event-Carried State Transfer

## **Decision Outcome**

The steer from the business is to continue with Event-Carried State Transfer, to future-proof the solution and remove any temporal coupling between the front office and back office. We have agreed to accept the risks to timelines that come with this decision.
