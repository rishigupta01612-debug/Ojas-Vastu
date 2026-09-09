import './Vastu.css'

function Vastu() {
  const elements = [['air', 'Air · Vayu', 'Northwest', 'Movement and fresh energy. Good for living rooms, guest rooms, and anywhere that needs ventilation.'], ['water', 'Water · Jal', 'Northeast', 'Flow and prosperity. The traditional spot for a water feature or a quiet meditation corner.'], ['space', 'Space · Akash', 'Center · Brahmasthan', 'Openness and connection. Keep this area light and uncluttered.'], ['earth', 'Earth · Prithvi', 'Southwest', 'Stability and grounding. Best for the master bedroom and heavier furniture.'], ['fire', 'Fire · Agni', 'Southeast', 'Energy and transformation. The classic placement for the kitchen.']]
  return <section className="section"><div className="wrap"><div className="subhead"><h3>The five elements of Vastu</h3><p>Panchabhuta &amp; their directions</p></div><div className="compass"><div className="dir-label dir-n">North</div><div className="dir-label dir-w">West</div><div className="dir-label dir-e">East</div><div className="dir-label dir-s">South</div>{elements.map(([className, title, direction, text]) => <div className={`el-card el-${className}`} key={title}><h4>{title}</h4><div className="el-dir">{direction}</div><p>{text}</p></div>)}</div></div></section>
}

export default Vastu