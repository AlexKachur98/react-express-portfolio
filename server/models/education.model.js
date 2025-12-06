/**
 * @file education.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Education/Qualification collection.
 */
import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema(
    {
        program: {
            type: String,
            trim: true,
            required: 'Program is required'
        },
        school: {
            type: String,
            trim: true,
            required: 'School is required'
        },
        period: {
            type: String,
            trim: true,
            required: 'Period is required'
        },
        location: {
            type: String,
            trim: true,
            required: 'Location is required'
        },
        details: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
); // Automatically adds createdAt and updatedAt

export default mongoose.model('Education', EducationSchema);
