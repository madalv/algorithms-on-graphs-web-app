# algorithms-on-graphs-web-app
## how to use?


Note: Even if initally your graph has capacity and is directed, once you click on an algorithm
button for undirected graph, all edges will be considered as undirected and the result will be
shown on an undirected graph. And vice-versa. The capacity switches to weight when needed and
vice-versa.

### <b>How do I...</b>


• <b>add edges?</b> Go to the big white text box below the graph and type your edges, then click
the Add Edges button next to it. Edges must be in the form: `vertex1 vertex2 weight`,
with one space between them. The weight obviously a number (integer) and vertices a string
or character. You can add more than one edge at once by writing each edge in a new line in
the text box.
Alternatively you can write all your edges in a .txt file and upload it using the Choose File
button.

• <b>delete the current graph or add a new one?</b> In either case, first click the Delete Graph
button. Next, clear the text box and add the edges you wish to form the new graph.

• <b>add start and end nodes?</b> Go the mini text boxes on the left of the big text box where
you write edges. In the box marked Start Nodes write the name (or names, depending on
the algorithm) of the vertices you wish to mark as start nodes. Same goes for end nodes.

• <b>see the result?</b> First, on the graph. If you're not sure what exactly you're seeing, make
sure you understand what the algorithm does properly. Second, in the dotted box on the left
of the big text box.

• <b>set custom colors?</b> Go to the navigation bar above and click Custom. Next, input a color
such as red or a hex code such as `#4287f5` to link or node color. Read the tooltips for more information (to see tooltips hover over Custom Link/Node Color). 
Important: You will only see your custom colors when the algorithm's result does not require special coloring
of links or nodes. Also, you must re-render the graph for the colors to show (re-run the
algorithm or press the Add Edges button).

• transpose graph? Go to Custom ! Transpose Graph.

• see bidirectional edges? If you have a graph with 2 edges between the same 2 nodes, you
might want to check the Arc links? checkbox under Custom to see them clearly. If the graph
is still moving, they will transform instantly. If not, click Add Edges or re-run the algorithm
to see them.

### <b>Why can't I...</b>

• <b>run the Max Flow algorithm!</b> Probably forgot to add start and end nodes, as is written
in the pop-up. Don't forget, you can add multiple start and end nodes for this algorithm!
Make sure there is at least a path between your sources and targets, or your 
ow will be
non-existent (0).

• <b>run the Shortest Path algorithm!</b> Probably forgot to add start and end nodes. Only
one of each though! Also, to second the shortest path in a directed graph, make sure there is an
actual path between the source and target, otherwise your shortest path will be non-existent.

• <b>see my custom colors!</b> In case of the Strongly Connected Components, Max Flow, or
Graph Coloring, the results must be shown by coloring nodes and links certain colors and
conflict with your custom set colors. For the other algorithms (and simple graphs) they
should be there! Also, see <i>How do I set custom colors?</i>

• <b>add edges</b> Most probably you're not using the necessary syntax. See <i>How do I add
edges? </i>
