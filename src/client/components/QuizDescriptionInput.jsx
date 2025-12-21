export function QuizDescriptionInput({ description, setDescription }) {
  return (
    <div className="form-group">
      <label>Description:</label><br/>
      <textarea 
        required
        className="form-textarea"
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        placeholder="Short description..."
      />
    </div>
  );
}