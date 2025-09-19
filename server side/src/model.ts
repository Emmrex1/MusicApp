import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    playlists: string[];
}
 
const schema: Schema<IUser> = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    
    email: { type: String,
             required: true, 
             unique: true 
            },
    
     password: { type: String,
                required: true 
            },
    
     role: { type: String, 
            enum: ['user', 'admin'], 
             default: 'user' },
    
     playlists: [{ type: String,
                  required: true 
                }]
}, { timestamps: true });   

const User = mongoose.model<IUser>('User', schema);
export default User;