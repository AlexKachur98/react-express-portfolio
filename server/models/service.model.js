/**
 * @file service.model.js
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
