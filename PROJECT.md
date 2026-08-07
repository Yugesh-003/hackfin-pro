# PROJECT.md

# AI-Powered Personalized Financial Learning Platform

## Overview

This project is an AI-powered financial education platform that transforms a user's financial transactions into a personalized learning journey.

Unlike budgeting applications that simply display spending statistics, this platform focuses on **teaching financial literacy**. It analyzes financial behavior, identifies weak areas, recommends appropriate lessons, validates learning through quizzes, and continuously mentors the user using AI.

The objective is to help users move from **financial awareness to financial literacy** through personalized education.

---

# Vision

Everyone manages money.

Very few people understand money.

Most financial education platforms provide generic content that does not relate to an individual's financial behavior.

Our platform bridges that gap by connecting **real financial habits** with **personalized financial education**.

Instead of saying:

> "You should learn budgeting."

the platform says:

> "Based on your recent spending, budgeting is currently your biggest opportunity for improvement."

---

# Core Philosophy

The platform is an educational application.

It is **NOT**

* a banking application
* an accounting software
* a budgeting application
* an investment platform

Financial data is used only to personalize learning.

---

# Primary Goals

* Teach financial literacy
* Personalize learning
* Reinforce concepts with quizzes
* Measure learning progress
* Encourage better financial habits
* Provide an AI mentor

---

# User Journey

Landing Page

↓

Sign Up / Login

↓

Choose Transaction Import Method

↓

Financial Analysis

↓

Financial Profile

↓

Personalized Learning Roadmap

↓

Lessons

↓

Quiz

↓

Dashboard

↓

AI Mentor

↓

Continuous Learning

---

# Transaction Sources

Users can provide transactions through multiple methods.

## Manual Entry

Users can manually add transactions.

Fields

* Date
* Description
* Category
* Amount
* Type

---

## CSV Upload

Users can upload a standardized CSV template.

Example

Date,Description,Category,Amount,Type

---

## Excel Upload

Users may upload Excel (.xlsx) files using the same standardized format.

---

## Multiple Accounts

A user may manage multiple accounts.

Example

* SBI
* HDFC
* ICICI

Transactions from all accounts are merged into one financial profile.

Internal transfers should be detected and excluded from spending analysis whenever possible.

---

# Financial Analysis Engine

This module is completely rule-based.

No AI is required.

The engine calculates:

* Monthly income
* Monthly expenses
* Savings rate
* Spending categories
* Category percentages
* Highest expense category
* Spending trends
* Subscription spending
* Debt / EMI spending
* Emergency fund estimation
* Cash flow
* Financial observations

Example observations

* High food delivery spending
* Low savings rate
* No investments detected
* Large discretionary expenses

These observations become the input for personalization.

---

# Learning Recommendation Engine

The recommendation engine determines:

* What the user should learn
* Lesson priority
* Weak areas
* Learning roadmap

Example

User A

Budgeting
↓

Saving
↓

Emergency Fund

User B

Investing
↓

Insurance
↓

Debt Management

The order is personalized.

The lesson content remains the same.

---

# Lesson Architecture

Lessons are intentionally short.

Approximate reading time

2–3 minutes

Each lesson contains

1. Title
2. Learning Objective
3. Static Educational Content
4. Key Takeaways
5. AI Personalized Insight
6. AI Personalized Action
7. Two Static Quiz Questions

---

# Static Content

Educational content is curated.

AI never generates the core educational concepts.

Reasons

* Higher accuracy
* Consistent quality
* Reduced hallucinations
* Easier maintenance
* Lower API costs

---

# AI Personalization

AI receives

* Lesson content
* Financial profile
* Lesson metadata

AI returns only

* Personalized Insight
* Personalized Action

AI contributes approximately **10–15%** of each lesson.

It must

* Never rewrite the lesson
* Never invent financial information
* Never shame the user
* Always encourage positive financial habits

---

# Quiz System

Every lesson ends with

Two multiple-choice questions.

Quizzes are static.

If a user fails

Review Lesson

↓

Retry Quiz

↓

Pass

↓

Unlock Next Lesson

---

# Lesson Topics

1. Budgeting & Spending
2. Smart Saving
3. Emergency Fund
4. Debt Management
5. Investing Basics
6. Financial Goal Planning
7. Insurance Essentials
8. Digital Payments & Financial Safety
9. Lifestyle & Spending Psychology
10. Becoming Financially Independent

---

# AI Mentor

The AI mentor has access to

* Financial profile
* Completed lessons
* Quiz history
* Current lesson
* Conversation history

The mentor answers questions using both financial behavior and educational context.

Examples

* Why was this lesson recommended?
* How can I improve my savings?
* Why is my spending considered high?
* What should I learn next?

---

# Dashboard

The dashboard is learning-focused.

Not finance-focused.

---

## Main Metrics

### Financial Literacy Score

Measures learning progress.

Factors

* Lessons completed
* Quiz accuracy
* Learning consistency
* Knowledge progression

---

### Financial Health Score

Measures financial habits.

Factors

* Savings rate
* Spending behavior
* Debt
* Emergency preparedness
* Financial trends

---

### Other Metrics

* Current Lesson
* Lesson Progress
* Quiz Accuracy
* Learning Streak
* Skill Progress
* AI Insights
* Achievements

---

# Skill Progress

Skills

* Budgeting
* Saving
* Emergency Fund
* Debt
* Investing
* Insurance
* Digital Safety

Each skill has an independent completion percentage.

---

# AI Insights

Generated periodically.

Examples

* Food delivery spending increased this month.
* Savings improved by 8%.
* Budgeting skills are improving.
* You are ready for Investing Basics.

---

# Achievements

Examples

* First Lesson
* First Quiz Passed
* Three-Day Streak
* Saving Explorer
* Budget Beginner
* Financial Learner

---

# Demo Accounts

Two demo accounts are included.

---

## Fresh Learner

Purpose

Demonstrates onboarding.

Characteristics

* No completed lessons
* Low literacy score
* Initial roadmap
* Beginner dashboard

---

## Returning Learner

Purpose

Demonstrates a mature learning journey.

Characteristics

* Multiple completed lessons
* Achievements unlocked
* High quiz accuracy
* AI insights available
* Advanced dashboard

---

# Technology Stack

Frontend

* React
* TypeScript
* Tailwind CSS
* Framer Motion

Backend

* Firebase Authentication
* Cloud Firestore

AI

* Groq API

Libraries

* PapaParse (CSV)
* SheetJS (Excel)
* React Router
* React Query (optional)
* Recharts (optional)

---

# Database Structure

users/

accounts/

transactions/

lessons/

quizResults/

progress/

achievements/

---

# Firestore Collections

users

Stores

* Profile
* Settings
* Scores

accounts

Stores

* Account Name
* Bank Name
* Account Type

transactions

Stores normalized transactions.

lessons

Stores completion state.

quizResults

Stores quiz history.

progress

Stores

* Literacy Score
* Health Score
* Current Lesson
* Lesson Progress

achievements

Stores unlocked badges.

---

# Design Principles

* Simple
* Minimal
* Educational
* Friendly
* Encouraging
* Mobile Responsive
* Accessible

---

# Out of Scope (Hackathon MVP)

* Live bank integrations
* PDF statement parsing
* Investment portfolio tracking
* Net worth tracking
* Loan calculators
* Tax filing
* Payment processing
* Open Banking APIs
* Real-time account synchronization

---

# Future Enhancements

* Bank API integrations
* PDF statement support
* OCR for scanned statements
* AI-generated practice scenarios
* Adaptive quiz difficulty
* Family financial learning
* Multi-language lessons
* Weekly AI financial reports
* Push notifications
* Financial goal tracking

---

# Success Criteria

A successful user should be able to

* Understand their financial habits
* Learn concepts relevant to their weaknesses
* Apply those concepts in real life
* Improve quiz performance
* Improve financial habits over time
* Increase both their Financial Literacy Score and Financial Health Score

---

# MVP Deliverables

✅ Landing Page

✅ Authentication

✅ Manual Transaction Entry

✅ CSV Upload

✅ Excel Upload

✅ Financial Analysis Engine

✅ Personalized Learning Roadmap

✅ 10 Curated Lessons

✅ AI-Personalized Insights & Actions

✅ Static Quizzes

✅ Learning Dashboard

✅ Financial Dashboard Metrics

✅ AI Mentor

✅ Demo Accounts

✅ Firebase Integration

---

# Guiding Principle

> "Don't just tell users how they spend. Teach them why it matters, how to improve, and guide them until better financial habits become second nature."
