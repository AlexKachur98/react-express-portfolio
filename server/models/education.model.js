/**
 * @file education.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Education/Qualification collection.
 */
import mongoose from 'mongoose';

// Note: This model is based on the 'qualifications' table in Assignment 2.pdf
const EducationSchema = new mongoose.Schema({
    institution: { 
        type: String, 
        trim: true, 
        required: 'Institution is required' 
    },
    degree: { 
        type: String, 
        trim: true, 
        required: 'Degree/Program is required' 
    },
    startDate: { 
        type: Date, 
        required: 'Start date is required' 
    },
    endDate: { 
        type: Date // Can be null if currently attending
    },
    description: { 
        type: String, 
        trim: true 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('Education', EducationSchema);
