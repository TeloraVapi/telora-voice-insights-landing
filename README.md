# Telora - AI Voice Feedback for Shopify Merchants

Transform post-purchase silence into actionable insights with AI-powered voice conversations.

**Built in 3 days during a hackathon** | **TypeScript + React + Voice AI**

## Overview

Telora bridges the feedback gap that merchants face after customers make purchases. Instead of hoping customers will leave written reviews, Telora proactively reaches out with AI-powered voice agents that conduct natural conversations to collect valuable feedback and reviews.

## The Problem & Solution

**Problem**: Most customers don't leave reviews after purchases, and merchants miss critical feedback about their products and experience.

**Solution**: AI agents automatically call customers after purchases, conduct natural conversations to collect spoken feedback, and transform responses into structured insights with sentiment analysis.

## Key Features

- **Smart Targeting**: Automatically identifies customers for follow-up based on purchase data
- **Conversational AI**: Natural voice interactions that feel human-like
- **Sentiment Analysis**: Categorizes feedback as positive, neutral, or negative
- **Analytics Dashboard**: Visual insights into customer satisfaction trends
- **Shopify Integration**: Seamless connection to store order data
- **Real-time Processing**: Instant conversion of voice to structured data

## Tech Stack

**Frontend**: React 18 with TypeScript, Real-time data visualization

**Backend**: FastAPI (Python), RESTful API architecture

**Voice AI**: VAPI for voice agents, Natural language processing, Speech-to-text

**Database**: Supabase, PostgreSQL

**Integrations**: Shopify API, Twilio for voice calls

## Architecture
Shopify Store → Telora API → Voice Agent (VAPI) → Twilio → Customer
↓             ↓              ↓
Order Webhook → Supabase DB → React Dashboard

## Setup

**Prerequisites**: Node.js 18+, Python 3.8+, Shopify store, VAPI account, Supabase project, Twilio account

```bash
# Clone and install
git clone https://github.com/pothuguntaumesh/telora.git
cd telora
npm install

# Backend setup
cd backend
pip install -r requirements.txt

# Configure environment variables for Shopify API, VAPI, Twilio, and Supabase

# Run application
uvicorn main:app --reload  # Backend
npm start                   # Frontend
```




How It Works

Shopify Integration: Webhooks trigger when customers make purchases
Smart Outreach: AI agents call customers at optimal times
Voice Conversations: Natural 2-3 minute conversations about their experience
Real-time Processing: Voice responses converted to structured feedback
Dashboard Insights: Merchants view sentiment analysis and actionable feedback

Current Status
Built and tested with my Shopify store during a 3-day hackathon. Demonstrates full voice AI integration, real-time data processing, and merchant dashboard functionality.
Future: Planning Shopify App Store submission and expanded integrations.
Technical Highlights

Real-time voice-to-text processing with sentiment analysis
Shopify webhook integration for automated customer outreach
Scalable architecture handling concurrent voice conversations
TypeScript frontend with Python FastAPI backend


Solving the post-purchase feedback gap with AI-powered voice conversations.

This version is much more concise while still showcasing the technical sophistication and business value. It emphasizes the "3-day hackathon" achievement and positions the project professionally without being overwhelming.
