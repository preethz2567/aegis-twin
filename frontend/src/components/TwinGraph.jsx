import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchTwinState } from '../api';

const NODE_COLORS = {
  'workstation': '#6B7A99',
  'server': '#4C5D7A',
  'database': '#526079',
  'ci-cd-runner': '#5A6B87',
  'credential-store': '#7A8AA8',
  'default': '#4A5568'
};

const TwinGraph = ({ attackPath, recommendedFixes, refreshTrigger }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let simulation;
    let isMounted = true;

    const loadDataAndRender = async () => {
      try {
        const data = await fetchTwinState();
        if (!isMounted) return;
        setStatus('ready');
        renderGraph(data);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setStatus('error');
        setErrorMsg('Failed to connect to backend.');
      }
    };

    const renderGraph = (data) => {
      if (!svgRef.current || !containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous

      svg.attr('width', width).attr('height', height);

      // Add zoom container
      const g = svg.append('g');

      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);
      
      // Data preparation
      data.nodes.forEach(node => {
        const scores = node.cves ? node.cves.map(c => c.score) : [0];
        node.maxScore = scores.length > 0 ? Math.max(...scores) : 0;
        node.radius = 15 + (node.maxScore * 1.5);
      });

      // Map edges to nodes for force simulation
      const edges = data.edges.map(e => ({
        source: data.nodes.find(n => n.id === e.source),
        target: data.nodes.find(n => n.id === e.target),
        risk_weight: e.risk_weight
      })).filter(e => e.source && e.target);

      // Simulation
      simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(edges).distance(150))
        .force('charge', d3.forceManyBody().strength(-1000))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(d => d.radius + 20));

      // Edges
      const link = g.append('g')
        .selectAll('line')
        .data(edges)
        .enter().append('line')
        .attr('stroke', '#30363d')
        .attr('stroke-width', d => Math.max(1, d.risk_weight * 0.8))
        .attr('stroke-opacity', d => 0.2 + (d.risk_weight / 10) * 0.6);

      // Nodes container
      const node = g.append('g')
        .selectAll('.node-group')
        .data(data.nodes)
        .enter().append('g')
        .attr('class', 'node-group')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      // Node circles
      node.append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => NODE_COLORS[d.type] || NODE_COLORS['default'])
        .attr('class', d => d.crown_jewel ? 'node-circle node-crown-jewel' : 'node-circle')
        .classed('node-is-fixed', d => d.is_fixed);

      // Initial checkmarks
      node.filter(d => d.is_fixed).append('text')
        .attr('class', 'fixed-icon')
        .attr('text-anchor', 'middle')
        .attr('dy', '4')
        .style('fill', '#3E8E8A')
        .style('font-weight', 'bold')
        .style('font-size', '16px')
        .style('pointer-events', 'none')
        .text('✓');

      // Node labels
      node.append('text')
        .text(d => d.name)
        .attr('x', d => d.radius + 8)
        .attr('y', 4)
        .attr('class', 'node-label');

      // Tick update
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('transform', d => `translate(${d.x},${d.y})`);
      });

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    };

    loadDataAndRender();

    const handleResize = () => {
       // Allow natural SVG resize or re-render
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      if (simulation) {
        simulation.stop();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !svgRef.current || refreshTrigger === 0) return;
    
    fetchTwinState().then(data => {
      const fixedSet = new Set(data.nodes.filter(n => n.is_fixed).map(n => n.id));
      const svg = d3.select(svgRef.current);
      
      svg.selectAll('.node-group').each(function(d) {
        const isFixed = fixedSet.has(d.id);
        d.is_fixed = isFixed;
        
        const group = d3.select(this);
        group.select('.node-circle').classed('node-is-fixed', isFixed);
        
        if (isFixed && group.select('.fixed-icon').empty()) {
           group.append('text')
             .attr('class', 'fixed-icon')
             .attr('text-anchor', 'middle')
             .attr('dy', '4')
             .style('fill', '#3E8E8A')
             .style('font-weight', 'bold')
             .style('font-size', '16px')
             .style('pointer-events', 'none')
             .text('✓')
             .style('opacity', 0)
             .transition().duration(750)
             .style('opacity', 1);
        } else if (!isFixed) {
           group.select('.fixed-icon')
             .transition().duration(300)
             .style('opacity', 0)
             .remove();
        }
      });
    }).catch(err => console.error(err));
  }, [refreshTrigger, status]);

  useEffect(() => {
    if (status !== 'ready' || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    // reset
    svg.selectAll('.node-circle').classed('node-dimmed node-highlighted node-fixed', false);
    svg.selectAll('.fix-ring').remove();
    svg.selectAll('line').classed('edge-dimmed edge-highlighted', false);
    
    if (!attackPath || attackPath.length === 0) {
      return;
    }
    
    svg.selectAll('.node-circle').classed('node-dimmed', true);
    svg.selectAll('line').classed('edge-dimmed', true);
    
    const pathSet = new Set(attackPath);
    
    svg.selectAll('.node-circle')
      .filter(d => pathSet.has(d.id))
      .classed('node-dimmed', false)
      .classed('node-highlighted', true);
      
    svg.selectAll('line')
      .filter(d => {
        for (let i = 0; i < attackPath.length - 1; i++) {
          if ((d.source.id === attackPath[i] && d.target.id === attackPath[i+1]) ||
              (d.target.id === attackPath[i] && d.source.id === attackPath[i+1])) {
            return true;
          }
        }
        return false;
      })
      .classed('edge-dimmed', false)
      .classed('edge-highlighted', true);
      
    if (recommendedFixes && recommendedFixes.length > 0) {
      const fixSet = new Set(recommendedFixes);
      
      const nodeGroups = svg.selectAll('.node-group').filter(d => fixSet.has(d.id));
      
      nodeGroups.insert('circle', '.node-circle')
        .attr('class', 'fix-ring')
        .attr('r', d => d.radius + 6)
        .attr('fill', 'none')
        .attr('stroke', '#3E8E8A')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '4,4');
        
      svg.selectAll('.node-circle')
        .filter(d => fixSet.has(d.id))
        .classed('node-fixed', true);
    }
      
  }, [attackPath, recommendedFixes, status]);

  return (
    <div className="graph-container" ref={containerRef}>
      {status === 'loading' && (
        <div className="status-overlay">Loading Network State...</div>
      )}
      {status === 'error' && (
        <div className="status-overlay error-overlay">{errorMsg}</div>
      )}
      
      <svg ref={svgRef} className="graph-svg"></svg>
      
      {status === 'ready' && (
        <div className="legend-panel">
          <div className="legend-title">Node Types</div>
          {Object.entries(NODE_COLORS).filter(([k]) => k !== 'default').map(([type, color]) => (
            <div className="legend-item" key={type}>
              <div className="legend-color" style={{ backgroundColor: color }}></div>
              <span>{type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}</span>
            </div>
          ))}
          <div className="legend-item" style={{ marginTop: '8px', borderTop: '1px solid #2A2A30', paddingTop: '8px' }}>
             <div className="legend-color" style={{ backgroundColor: 'transparent', border: '2px solid #C9A24B' }}></div>
             <span>Crown Jewel</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwinGraph;
