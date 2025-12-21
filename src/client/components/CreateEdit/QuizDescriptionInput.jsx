export function QuizDescriptionInput({ description, setDescription, maxDescriptionLength }) {
  return (
    <div className="form-group">
      <label>Description:
          <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "#666" }}>
            [{description.length} / {maxDescriptionLength} ] 
          </span>
        </label><br/>
      <textarea 
        required
        className="form-textarea"
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        placeholder="Short description..."
        autoComplete="off"
        maxLength={400}
      />
    </div>
  );
}