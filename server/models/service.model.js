/**
 * @file service.model.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines the Mongoose schema and model for service offerings.
 */
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    description: {
        type: String,
        trim: true,
        required: 'Description is required'
    },
    highlight: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        trim: true
    },
    iconLabel: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Service', ServiceSchema);
