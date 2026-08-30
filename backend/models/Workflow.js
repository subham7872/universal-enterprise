import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  conditions: { type: String, default: '' },
  action: { type: String, required: true },
  enabled: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema);
export default Workflow;
