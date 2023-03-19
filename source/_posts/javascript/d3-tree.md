---
title: d3实现的可伸缩树
date: 2023-03-19 16:24:59
tags:
  - javascript
categories:
  - javascript
---
## 效果
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/tree-d3-1.gif)

![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/tree-d3-2.gif)


## 代码
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>indented tree</title>
  <style>
    * {
      margin: 0 0;
    }
  </style>
</head>

<body>
  <div>
    <div id="content"
      style="position: absolute; min-height: 100vh;  background-color: rgba(128, 128, 128, 0.089); width: 250px; z-index: 100;">
    </div>
    <div
      style="background-color: transparent; width: 100vw; display: flex;justify-content: center;align-items: center; z-index: 1;">
      <div id="tree"></div>
    </div>
  </div>



  <script type="module">

    import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


    function indentTree(data, { nodeSize = 25, minWidth = 0 } = {}) {
      let width = minWidth;

      // 前序遍历? d.index用于计算布局，d.id用于更新
      const root = d3.hierarchy(data);

      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        d.y = i * nodeSize;

        // 如果需要在启动的时候就处于折叠状态，则将下面这行取消注释
        d.children = null;

        // 计算最小尺寸, 假设一个字符占12个像素
        const tmp = d.depth * nodeSize + d.data.name.length * 10 + 6;
        width = tmp > width ? tmp : width;
      });

      const svg = d3.create("svg")
        .attr("viewBox", [-nodeSize / 2, -nodeSize * 3 / 2, width, 2 * nodeSize])
        .attr("font-family", "sans-serif")
        .attr("font-size", 18)
        .style("overflow", "visible");

      const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#999");

      const gNode = svg.append("g");

      // bias_y 父节点的纵向偏移
      function update(source, bias_y) {

        // 前序遍历, 更新位置
        root.eachBefore((d, i) => {
          d.y = i * nodeSize;
        });

        const duration = 800;
        const nodes = root.descendants();
        const links = root.links();


        const transition = svg.transition()
          .duration(duration)
          .attr("viewBox", [-nodeSize / 2, -nodeSize * 3 / 2, width, (nodes.length + 1) * nodeSize])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));


        const node = gNode.selectAll("g").data(nodes, d => d.id);


        const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(0, ${bias_y})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

        nodeEnter.append("circle")
          .attr("cx", d => d.depth * nodeSize)
          .attr("r", 5)
          .attr("fill", d => d._children ? null : "#999")
          .on("click", (event, d) => {
            d.children = d.children ? null : d._children;
            update(d, d.y);
          });

        nodeEnter.append("text")
          .attr("dy", "0.32em")
          .attr("x", d => d.depth * nodeSize + 8)
          .text(d => d.data.name)
          .attr("cursor", "pointer")
          .on("click", (event, d) => {

            const tree = collapsibleTree(d.data);
            const dom = document.getElementById('tree');
            dom.innerHTML = '';
            dom.appendChild(tree);
          })
          .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");

        node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(0, ${d.y})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

        node.exit().transition(transition).remove()
          .attr("transform", d => `translate(0, ${bias_y})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

        const link = gLink.selectAll("path")
          .data(links, d => d.target.id);

        const linkEnter = link.enter().append("path")
          .attr("d", d => `
          M${d.source.depth * nodeSize},${bias_y}
          V${bias_y}
          h${nodeSize}
        `);

        link.merge(linkEnter).transition(transition)
          .attr("d", d => `
          M${d.source.depth * nodeSize},${d.source.y}
          V${d.target.y}
          h${nodeSize}
        `);

        link.exit().transition(transition).remove()
          .attr("d", d => `
          M${d.source.depth * nodeSize},${bias_y}
          V${bias_y}
          h${nodeSize}`)
      }

      update(root, 0);
      return svg.node();
    }

    function collapsibleTree(data, {
      id = Array.isArray(data) ? d => d.id : null,
      parentId = Array.isArray(data) ? d => d.parentId : null,
      tree = d3.tree,
      r = 5,
      padding = 1,
      stroke = "#555",
      strokeWidth = 1.5,
      strokeOpacity = 0.4,
      curve = d3.curveBumpX,
      dx = 78,
      dy = 84,
      margin = { top: 40, right: 120, bottom: 10, left: 40 }
    } = {}) {

      const root = d3.hierarchy(data);
      const diagonal = d3.linkVertical(curve).x(d => d.x).y(d => d.y);
      const tree_func = tree().nodeSize([dx, dy]);


      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        d.children = null;
      });

      const svg = d3.create("svg")
        // .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "10px sans-serif")
        .attr("font-size", 18)
        .style("user-select", "none");

      const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

      const gNode = svg.append("g")
        // .attr("cursor", "pointer")
        .attr("pointer-events", "all");

      function update(source, from_x, from_y) {
        const duration = d3.event && d3.event.altKey ? 2500 : 300;

        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree_func(root);

        let left = root;
        let right = root;
        let top = root;
        let bottom = root;
        root.eachBefore(node => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.y < top.y) top = node;
          if (node.y > bottom.y) bottom = node;
        });

        // const height = right.x - left.x + margin.top + margin.bottom;
        const width = right.x - left.x + margin.left + margin.right;
        const height = bottom.y - top.y + margin.top + margin.bottom;

        const transition = svg.transition()
          .duration(duration)
          .attr('height', height)
          .attr('width', width)
          .attr("viewBox", [-margin.left + left.x, top.y - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
          .data(nodes, d => d.id);


        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${from_x},${from_y})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

        nodeEnter.append("circle")
          .attr("r", r)
          .attr("fill", d => d._children ? "#333" : "#999")
          .attr("stroke-width", strokeWidth).attr("cursor", d => d._children ? "pointer": "default")
          .on("pointerdown", (event, d) => {
            d.children = d.children ? null : d._children;
            update(d, d.x, d.y);
          })
          ;

        nodeEnter.append("title")
          .text(d => d.data.name);

        nodeEnter.append("text")
          .attr("y", -8)
          .attr("text-anchor", "middle")
          .text(d => d.data.name)
          .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.x},${d.y})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.x},${source.y})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
          .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = { x: from_x, y: from_y };
            return diagonal({ source: o, target: o });
          });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
          .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
          });
      }

      update(root, 0, 0);

      return svg.node();
    }






    const content = indentTree(flare);

    document.getElementById('content').appendChild(content);

    const tree = collapsibleTree(flare);
    document.getElementById('tree').appendChild(tree);

    // 增加一些拖拽和缩放功能。
    bindEvents(document.getElementById('tree'));




    function bindEvents(element) {
      let scale = 1.0, maxScale = 4, minScale = 0.05;
      let isPointerdown = false, lastPointermove = { x: 0, y: 0 };
      let x = 0, y = 0;

      document.body.onresize = () => setSize(element);
      // 绑定滚轮缩放
      element.addEventListener('wheel', (e) => {
        let ratio = 1.1;
        // 缩小
        if (e.deltaY > 0) {
          ratio = 1 / 1.1;
        }
        scale *= ratio;
        if (scale > maxScale) scale = maxScale;
        else if (scale < minScale) scale = minScale;

        // scale 后面不要有空格 translateX 里面一定要有单位
        const transform = `translateX(${x}px) translateY(${y}px) scale(${scale})`;
        element.style.transform = transform;

        // 预防执行默认的行为
        e.preventDefault();
      });

      // 绑定拖拽功能
      element.addEventListener('pointerdown', (e) => {
        if (e.button == 0) {
          isPointerdown = true;
          element.setPointerCapture(e.pointerId);
          lastPointermove = { x: e.clientX, y: e.clientY };
          // e.preventDefault();
        }
      });

      element.addEventListener('pointerup', (e) => {
        if (e.button == 0) {
          isPointerdown = false;
          // e.preventDefault();
        }

      });

      element.addEventListener('pointermove', (e) => {
        if (isPointerdown) {
          const current = { x: e.clientX, y: e.clientY };
          const dx = current.x - lastPointermove.x;
          const dy = current.y - lastPointermove.y;
          lastPointermove = { x: current.x, y: current.y };
          x += dx; y += dy;

          const transform = `translateX(${x}px) translateY(${y}px) scale(${scale})`;
          element.style.transform = transform;

          e.preventDefault();
        }

      });

      setSize(element);
    }
    function setSize(element) {
      if (element.scrollWidth > window.innerWidth || element.scrollHeight > window.innerHeight) {
        element.style.width = window.innerWidth + 'px';
        element.style.height = window.innerHeight + 'px';
      }
    }

  </script>
</body>

</html>
```

`flare`中的内容如下：
```json
{
  "name": "flare",
  "children": [
   {
    "name": "analytics",
    "children": [
     {
      "name": "cluster",
      "children": [
       {"name": "AgglomerativeCluster", "value": 3938},
       {"name": "CommunityStructure", "value": 3812},
       {"name": "HierarchicalCluster", "value": 6714},
       {"name": "MergeEdge", "value": 743, "error": true }
      ]
     },
     {
      "name": "graph",
      "children": [
       {"name": "BetweennessCentrality", "value": 3534},
       {"name": "LinkDistance", "value": 5731},
       {"name": "MaxFlowMinCut", "value": 7840},
       {"name": "ShortestPaths", "value": 5914},
       {"name": "SpanningTree", "value": 3416}
      ]
     },
     {
      "name": "optimization",
      "children": [
       {"name": "AspectRatioBanker", "value": 7074}
      ]
     }
    ]
   },
   {
    "name": "animate",
    "children": [
     {"name": "Easing", "value": 17010},
     {"name": "FunctionSequence", "value": 5842},
     {
      "name": "interpolate",
      "children": [
       {"name": "ArrayInterpolator", "value": 1983},
       {"name": "ColorInterpolator", "value": 2047},
       {"name": "DateInterpolator", "value": 1375},
       {"name": "Interpolator", "value": 8746},
       {"name": "MatrixInterpolator", "value": 2202},
       {"name": "NumberInterpolator", "value": 1382},
       {"name": "ObjectInterpolator", "value": 1629},
       {"name": "PointInterpolator", "value": 1675},
       {"name": "RectangleInterpolator", "value": 2042}
      ]
     },
     {"name": "ISchedulable", "value": 1041},
     {"name": "Parallel", "value": 5176},
     {"name": "Pause", "value": 449},
     {"name": "Scheduler", "value": 5593},
     {"name": "Sequence", "value": 5534},
     {"name": "Transition", "value": 9201},
     {"name": "Transitioner", "value": 19975},
     {"name": "TransitionEvent", "value": 1116},
     {"name": "Tween", "value": 6006}
    ]
   },
   {
    "name": "data",
    "children": [
     {
      "name": "converters",
      "children": [
       {"name": "Converters", "value": 721},
       {"name": "DelimitedTextConverter", "value": 4294},
       {"name": "GraphMLConverter", "value": 9800},
       {"name": "IDataConverter", "value": 1314},
       {"name": "JSONConverter", "value": 2220}
      ]
     },
     {"name": "DataField", "value": 1759},
     {"name": "DataSchema", "value": 2165},
     {"name": "DataSet", "value": 586},
     {"name": "DataSource", "value": 3331},
     {"name": "DataTable", "value": 772},
     {"name": "DataUtil", "value": 3322}
    ]
   },
   {
    "name": "display",
    "children": [
     {"name": "DirtySprite", "value": 8833},
     {"name": "LineSprite", "value": 1732},
     {"name": "RectSprite", "value": 3623},
     {"name": "TextSprite", "value": 10066}
    ]
   },
   {
    "name": "flex",
    "children": [
     {"name": "FlareVis", "value": 4116}
    ]
   },
   {
    "name": "physics",
    "children": [
     {"name": "DragForce", "value": 1082},
     {"name": "GravityForce", "value": 1336},
     {"name": "IForce", "value": 319},
     {"name": "NBodyForce", "value": 10498},
     {"name": "Particle", "value": 2822},
     {"name": "Simulation", "value": 9983},
     {"name": "Spring", "value": 2213},
     {"name": "SpringForce", "value": 1681}
    ]
   },
   {
    "name": "query",
    "children": [
     {"name": "AggregateExpression", "value": 1616},
     {"name": "And", "value": 1027},
     {"name": "Arithmetic", "value": 3891},
     {"name": "Average", "value": 891},
     {"name": "BinaryExpression", "value": 2893},
     {"name": "Comparison", "value": 5103},
     {"name": "CompositeExpression", "value": 3677},
     {"name": "Count", "value": 781},
     {"name": "DateUtil", "value": 4141},
     {"name": "Distinct", "value": 933},
     {"name": "Expression", "value": 5130},
     {"name": "ExpressionIterator", "value": 3617},
     {"name": "Fn", "value": 3240},
     {"name": "If", "value": 2732},
     {"name": "IsA", "value": 2039},
     {"name": "Literal", "value": 1214},
     {"name": "Match", "value": 3748},
     {"name": "Maximum", "value": 843},
     {
      "name": "methods",
      "children": [
       {"name": "add", "value": 593},
       {"name": "and", "value": 330},
       {"name": "average", "value": 287},
       {"name": "count", "value": 277},
       {"name": "distinct", "value": 292},
       {"name": "div", "value": 595},
       {"name": "eq", "value": 594},
       {"name": "fn", "value": 460},
       {"name": "gt", "value": 603},
       {"name": "gte", "value": 625},
       {"name": "iff", "value": 748},
       {"name": "isa", "value": 461},
       {"name": "lt", "value": 597},
       {"name": "lte", "value": 619},
       {"name": "max", "value": 283},
       {"name": "min", "value": 283},
       {"name": "mod", "value": 591},
       {"name": "mul", "value": 603},
       {"name": "neq", "value": 599},
       {"name": "not", "value": 386},
       {"name": "or", "value": 323},
       {"name": "orderby", "value": 307},
       {"name": "range", "value": 772},
       {"name": "select", "value": 296},
       {"name": "stddev", "value": 363},
       {"name": "sub", "value": 600},
       {"name": "sum", "value": 280},
       {"name": "update", "value": 307},
       {"name": "variance", "value": 335},
       {"name": "where", "value": 299},
       {"name": "xor", "value": 354},
       {"name": "-", "value": 264}
      ]
     },
     {"name": "Minimum", "value": 843},
     {"name": "Not", "value": 1554},
     {"name": "Or", "value": 970},
     {"name": "Query", "value": 13896},
     {"name": "Range", "value": 1594},
     {"name": "StringUtil", "value": 4130},
     {"name": "Sum", "value": 791},
     {"name": "Variable", "value": 1124},
     {"name": "Variance", "value": 1876},
     {"name": "Xor", "value": 1101}
    ]
   },
   {
    "name": "scale",
    "children": [
     {"name": "IScaleMap", "value": 2105},
     {"name": "LinearScale", "value": 1316},
     {"name": "LogScale", "value": 3151},
     {"name": "OrdinalScale", "value": 3770},
     {"name": "QuantileScale", "value": 2435},
     {"name": "QuantitativeScale", "value": 4839},
     {"name": "RootScale", "value": 1756},
     {"name": "Scale", "value": 4268},
     {"name": "ScaleType", "value": 1821},
     {"name": "TimeScale", "value": 5833}
    ]
   },
   {
    "name": "util",
    "children": [
     {"name": "Arrays", "value": 8258},
     {"name": "Colors", "value": 10001},
     {"name": "Dates", "value": 8217},
     {"name": "Displays", "value": 12555},
     {"name": "Filter", "value": 2324},
     {"name": "Geometry", "value": 10993},
     {
      "name": "heap",
      "children": [
       {"name": "FibonacciHeap", "value": 9354},
       {"name": "HeapNode", "value": 1233}
      ]
     },
     {"name": "IEvaluable", "value": 335},
     {"name": "IPredicate", "value": 383},
     {"name": "IValueProxy", "value": 874},
     {
      "name": "math",
      "children": [
       {"name": "DenseMatrix", "value": 3165},
       {"name": "IMatrix", "value": 2815},
       {"name": "SparseMatrix", "value": 3366}
      ]
     },
     {"name": "Maths", "value": 17705},
     {"name": "Orientation", "value": 1486},
     {
      "name": "palette",
      "children": [
       {"name": "ColorPalette", "value": 6367},
       {"name": "Palette", "value": 1229},
       {"name": "ShapePalette", "value": 2059},
       {"name": "SizePalette", "value": 2291}
      ]
     },
     {"name": "Property", "value": 5559},
     {"name": "Shapes", "value": 19118},
     {"name": "Sort", "value": 6887},
     {"name": "Stats", "value": 6557},
     {"name": "Strings", "value": 22026}
    ]
   },
   {
    "name": "vis",
    "children": [
     {
      "name": "axis",
      "children": [
       {"name": "Axes", "value": 1302},
       {"name": "Axis", "value": 24593},
       {"name": "AxisGridLine", "value": 652},
       {"name": "AxisLabel", "value": 636},
       {"name": "CartesianAxes", "value": 6703}
      ]
     },
     {
      "name": "controls",
      "children": [
       {"name": "AnchorControl", "value": 2138},
       {"name": "ClickControl", "value": 3824},
       {"name": "Control", "value": 1353},
       {"name": "ControlList", "value": 4665},
       {"name": "DragControl", "value": 2649},
       {"name": "ExpandControl", "value": 2832},
       {"name": "HoverControl", "value": 4896},
       {"name": "IControl", "value": 763},
       {"name": "PanZoomControl", "value": 5222},
       {"name": "SelectionControl", "value": 7862},
       {"name": "TooltipControl", "value": 8435}
      ]
     },
     {
      "name": "data",
      "children": [
       {"name": "Data", "value": 20544},
       {"name": "DataList", "value": 19788},
       {"name": "DataSprite", "value": 10349},
       {"name": "EdgeSprite", "value": 3301},
       {"name": "NodeSprite", "value": 19382},
       {
        "name": "render",
        "children": [
         {"name": "ArrowType", "value": 698},
         {"name": "EdgeRenderer", "value": 5569},
         {"name": "IRenderer", "value": 353},
         {"name": "ShapeRenderer", "value": 2247}
        ]
       },
       {"name": "ScaleBinding", "value": 11275},
       {"name": "Tree", "value": 7147},
       {"name": "TreeBuilder", "value": 9930}
      ]
     },
     {
      "name": "events",
      "children": [
       {"name": "DataEvent", "value": 2313},
       {"name": "SelectionEvent", "value": 1880},
       {"name": "TooltipEvent", "value": 1701},
       {"name": "VisualizationEvent", "value": 1117}
      ]
     },
     {
      "name": "legend",
      "children": [
       {"name": "Legend", "value": 20859},
       {"name": "LegendItem", "value": 4614},
       {"name": "LegendRange", "value": 10530}
      ]
     },
     {
      "name": "operator",
      "children": [
       {
        "name": "distortion",
        "children": [
         {"name": "BifocalDistortion", "value": 4461},
         {"name": "Distortion", "value": 6314},
         {"name": "FisheyeDistortion", "value": 3444}
        ]
       },
       {
        "name": "encoder",
        "children": [
         {"name": "ColorEncoder", "value": 3179},
         {"name": "Encoder", "value": 4060},
         {"name": "PropertyEncoder", "value": 4138},
         {"name": "ShapeEncoder", "value": 1690},
         {"name": "SizeEncoder", "value": 1830}
        ]
       },
       {
        "name": "filter",
        "children": [
         {"name": "FisheyeTreeFilter", "value": 5219},
         {"name": "GraphDistanceFilter", "value": 3165},
         {"name": "VisibilityFilter", "value": 3509}
        ]
       },
       {"name": "IOperator", "value": 1286},
       {
        "name": "label",
        "children": [
         {"name": "Labeler", "value": 9956},
         {"name": "RadialLabeler", "value": 3899},
         {"name": "StackedAreaLabeler", "value": 3202}
        ]
       },
       {
        "name": "layout",
        "children": [
         {"name": "AxisLayout", "value": 6725},
         {"name": "BundledEdgeRouter", "value": 3727},
         {"name": "CircleLayout", "value": 9317},
         {"name": "CirclePackingLayout", "value": 12003},
         {"name": "DendrogramLayout", "value": 4853},
         {"name": "ForceDirectedLayout", "value": 8411},
         {"name": "IcicleTreeLayout", "value": 4864},
         {"name": "IndentedTreeLayout", "value": 3174},
         {"name": "Layout", "value": 7881},
         {"name": "NodeLinkTreeLayout", "value": 12870},
         {"name": "PieLayout", "value": 2728},
         {"name": "RadialTreeLayout", "value": 12348},
         {"name": "RandomLayout", "value": 870},
         {"name": "StackedAreaLayout", "value": 9121},
         {"name": "TreeMapLayout", "value": 9191}
        ]
       },
       {"name": "Operator", "value": 2490},
       {"name": "OperatorList", "value": 5248},
       {"name": "OperatorSequence", "value": 4190},
       {"name": "OperatorSwitch", "value": 2581},
       {"name": "SortOperator", "value": 2023}
      ]
     },
     {"name": "Visualization", "value": 16540}
    ]
   }
  ]
 }
```
