import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
export function Eyebrow({children}){return <div className="eyebrow"><span/> {children}</div>}
export function SectionTitle({eyebrow,title,copy}){return <div className="section-title"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>}
export function CTA({title='Have a challenge worth solving?',copy='Tell us what you are building. We will help you find a practical next step.',to='/contact'}){return <section className="cta-band"><div><Eyebrow>START A CONVERSATION</Eyebrow><h2>{title}</h2><p>{copy}</p></div><Link className="button button-gold" to={to}>Talk to our team <ArrowUpRight size={17}/></Link></section>}
export function PageHero({eyebrow,title,copy}){return <section className="page-hero"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></section>}
export function Field({label,name,type='text',required=true,placeholder}){return <label className="field"><span>{label}{required?' *':''}</span><input name={name} type={type} required={required} placeholder={placeholder||label}/></label>}
export function TextArea({label,name,required=true,rows=4}){return <label className="field"><span>{label}{required?' *':''}</span><textarea name={name} required={required} rows={rows} placeholder={label}/></label>}
