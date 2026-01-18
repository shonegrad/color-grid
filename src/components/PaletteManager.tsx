import React, { useEffect, useState } from 'react'

type Palette = { id: string; name: string; colors: string[]; createdAt: string }

const STORAGE_KEY = 'palette.palettes.v1'

export function PaletteManager(){
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [name, setName] = useState('New Palette')
  const [colorInput, setColorInput] = useState('#ff0000')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw ? JSON.parse(raw) as Palette[] : []
      setPalettes(data)
      if (data.length > 0) setSelected(data[0].id)
    } catch(e){ console.error(e) }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
  }, [palettes])

  const createPalette = () => {
    const id = Math.random().toString(36).slice(2,9)
    const p: Palette = { id, name, colors: [colorInput], createdAt: new Date().toISOString() }
    setPalettes(v => [p, ...v])
    setSelected(id)
  }

  const addColor = (pid: string) => {
    setPalettes(ps => ps.map(p => p.id === pid ? { ...p, colors: [...p.colors, colorInput] } : p))
  }

  const removeColor = (pid: string, idx: number) => {
    setPalettes(ps => ps.map(p => p.id === pid ? { ...p, colors: p.colors.filter((_,i)=> i!==idx) } : p))
  }

  const deletePalette = (pid: string) => {
    setPalettes(ps => ps.filter(p => p.id !== pid))
    if (selected === pid) setSelected(null)
  }

  const renamePalette = (pid: string, newName: string) => {
    setPalettes(ps => ps.map(p => p.id === pid ? { ...p, name: newName } : p))
  }

  const current = palettes.find(p => p.id === selected)

  return (
    <div style={{display:'flex', gap:20}}>
      <div style={{minWidth:240}}>
        <h3>Palettes</h3>
        <div>
          {palettes.map(p => (
            <div key={p.id} style={{padding:6, border: '1px solid #ccc', marginBottom:6, cursor:'pointer', background: p.id===selected? '#eef' : '#fff'}} onClick={()=>setSelected(p.id)}>
              <div style={{fontWeight:600}}>{p.name}</div>
              <div style={{fontSize:12}}>{p.colors.length} colors</div>
              <div style={{display:'flex', gap:4, marginTop:4}}>
                {p.colors.map((c,i)=> (
                  <span key={i} style={{width:12, height:12, display:'inline-block', background:c}} />
                ))}
              </div>
              <button onClick={()=>deletePalette(p.id)} style={{marginLeft:8}}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1}}>
        <h3>Palette Editor</h3>
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Palette name"/>
          <button onClick={createPalette}>Create</button>
        </div>
        {current && (
          <div>
            <div style={{display:'flex', gap:6, alignItems:'center', marginBottom:8}}>
              {current.colors.map((c,i)=> (
                <span key={i} style={{width:24, height:24, display:'inline-block', background:c}}/>
              ))}
            </div>
            <div style={{display:'flex', gap:6, alignItems:'center', marginBottom:8}}>
              <input type="color" value={colorInput} onChange={e=>setColorInput(e.target.value)} />
              <button onClick={()=>addColor(current.id)}>Add color</button>
              <button onClick={()=>renamePalette(current.id, name)}>Rename</button>
              <button onClick={()=>navigator.clipboard?.writeText(JSON.stringify(current.colors))}>Copy colors</button>
            </div>
            <div style={{marginTop:8}}>
              <button onClick={()=>downloadPalette(current)}>Export JSON</button>
              <button onClick={()=>importPalette(setPalettes, palettes)}>Import JSON</button>
            </div>
          </div>
        )}
        {!current && <div>Select or create a palette to begin.</div>}
      </div>
    </div>
  )
}

function downloadPalette(p: { id:string; name:string; colors:string[]; createdAt:string }){
  const blob = new Blob([JSON.stringify(p, null, 2)], {type:'application/json'})
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${p.name.replace(/\s+/g,'_')}.palette.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

async function importPalette(setPalettes:(p: any)=>void, currentPalettes:any[]){
  const input = document.createElement('input')
  input.type='file'
  input.accept='application/json'
  input.onchange = async ()=>{
    const f = input.files?.[0]
    if(!f) return
    const text = await f.text()
    try{ const parsed = JSON.parse(text) as any; if(Array.isArray(parsed.colors)){ setPalettes?.( (p:any)=> [ ...p, parsed ] ); } }
    catch(e){ alert('Invalid palette JSON') }
  }
  input.click()
}

export {} // avoid isolated modules
