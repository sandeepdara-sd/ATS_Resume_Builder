import express from 'express';
import Feedback from '../models/Feedback.js';
import admin from '../config/firebase.js';



// Submit/Update Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { type, message, rating, email, category } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const userEmail = decodedToken.email;

    if (type === 'general') {
      // Upsert: Update existing feedback or create a new one
      const updatedFeedback = await Feedback.findOneAndUpdate(
        { firebaseUid }, // Match feedback for this user
        { 
          type, 
          message, 
          rating, 
          email: email || userEmail, // Use provided email or Firebase email
          category,
          updatedAt: new Date()
        }, // New data
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // console.log('✅ Feedback saved or updated:', updatedFeedback._id);
      return res.status(201).json({ 
        message: 'Feedback submitted successfully',
        feedback: updatedFeedback
      });
    } else {
      // For non-general feedback, still save to database for history
      const newFeedback = new Feedback({
        firebaseUid,
        type,
        message,
        rating,
        email: email || userEmail,
        category,
        isEmailJSFeedback: true // Flag to indicate this was also sent via EmailJS
      });

      await newFeedback.save();
      
      console.log('📧 Feedback of type', type, 'saved and will be sent via EmailJS frontend');
      return res.status(200).json({ 
        message: 'Feedback handled via EmailJS',
        feedback: newFeedback
      });
    }
  } catch (err) {
    console.error('❌ Feedback submission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get User's Previous Feedback
export const getUserFeedback = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Get the most recent general feedback for this user
    const feedback = await Feedback.findOne({ 
      firebaseUid, 
      type: 'general' 
    }).sort({ updatedAt: -1 });

    if (feedback) {
      return res.status(200).json({ 
        feedback: {
          type: feedback.type,
          message: feedback.message,
          rating: feedback.rating,
          email: feedback.email,
          category: feedback.category
        }
      });
    } else {
      return res.status(200).json({ 
        feedback: null,
        userEmail: decodedToken.email // Return user's email for auto-fill
      });
    }
  } catch (err) {
    console.error('❌ Get feedback error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All User's Feedback History
export const getUserFeedbackHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const feedbacks = await Feedback.find({ firebaseUid })
      .sort({ createdAt: -1 })
      .limit(10); // Get last 10 feedback entries

    return res.status(200).json({ feedbacks });
  } catch (err) {
    console.error('❌ Get feedback history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
