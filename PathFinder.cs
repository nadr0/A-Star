using UnityEngine;
using System.Collections;
using System.Collections.Generic;
public class PathFinder : MonoBehaviour {

	public List<GameObject> openlist = new List<GameObject>();
	public List<GameObject> closedlist = new List<GameObject>();
	public List<GameObject> AllNodes = new List<GameObject>();
	public List<GameObject> TempList = new List<GameObject>();
	public Queue<GameObject> FinalPath = new Queue<GameObject>();
	public GameObject checkingNode;
	public GameObject StartNode;
	public GameObject TargetNode;

	private Transform NearestNodeToPlayer;
	private Transform NearestNodeToEnemy;

	public GameObject MainPlayer;
	public GameObject Enemy;
	private EnemyMovement enemymovementscript;

	public bool stoppath = false;
	public bool targetfound = false;
	public int MoveCost = 10; 
	
	void Start () {
		checkingNode = StartNode;
		GameObject[] Nodes;
		Nodes = GameObject.FindGameObjectsWithTag("Node");
		enemymovementscript = Enemy.GetComponent("EnemyMovement") as EnemyMovement;
		foreach(GameObject Node in Nodes){
			AllNodes.Add(Node);
		}


	}

	void Update () {
		TargetNode = GetNearestNode();
		//StartNode = GetNearestNodeToEnemy();
		//checkingNode = StartNode;
		FindAllHueristicValues();
	

			if(targetfound == false && enemymovementscript.SeeTarget == false){
				FindPath();
			}

			if(targetfound == true){
				if(stoppath == false){
				TraceBackPath();
				}
			}


	}
	

	GameObject GetNearestNodeToEnemy() {
		float nearestDistanceSqr = Mathf.Infinity;
		GameObject[] NodeGameObjects = GameObject.FindGameObjectsWithTag("Node"); 
		GameObject nearestNode = null;
		
		foreach (GameObject node in NodeGameObjects) {
			
			Vector3 NodePosition = node.transform.position;
			float distanceSqr = (NodePosition - Enemy.transform.position).sqrMagnitude;
			
			if (distanceSqr < nearestDistanceSqr) {
				nearestNode = node.transform.gameObject;
				nearestDistanceSqr = distanceSqr;
			}
		}
		return nearestNode;
	}

	GameObject GetNearestNode() {
		float nearestDistanceSqr = Mathf.Infinity;
		GameObject[] NodeGameObjects = GameObject.FindGameObjectsWithTag("Node"); 
		GameObject nearestNode = null;

		foreach (GameObject node in NodeGameObjects) {
			
			Vector3 NodePosition = node.transform.position;
			float distanceSqr = (NodePosition - MainPlayer.transform.position).sqrMagnitude;
			
			if (distanceSqr < nearestDistanceSqr) {
				nearestNode = node.transform.gameObject;
				nearestDistanceSqr = distanceSqr;
			}
		}
		return nearestNode;
	}


	void FindPath(){

		Node node;
		node = checkingNode.GetComponent("Node") as Node;
		if(targetfound == false){
			if(node.north != null){
				JUXTANODESITION(checkingNode, node.north);
			}
			if(node.south != null){
				JUXTANODESITION(checkingNode, node.south);
			}
			if(node.east != null){
				JUXTANODESITION(checkingNode, node.east);
			}
			if(node.west != null){
				JUXTANODESITION(checkingNode, node.west);
			}
		}
		if(targetfound == false){

			AddtoClosedList(checkingNode);
			RemoveFromOpenList(checkingNode);

			checkingNode = GetSmallestFValueNode();
		}
	}

	void JUXTANODESITION(GameObject currentNode, GameObject testing){
		if(testing == null){
			return;
		}
		if(testing == TargetNode){
			Node TTNode;
			TTNode = TargetNode.GetComponent("Node") as Node;

			TTNode.parentnode = currentNode;
			targetfound = true;
			return;
		}

		if(closedlist.Contains(testing) == false){

			if(openlist.Contains(testing) == true){
				Node Cnode;
				Node TNode;
				Cnode = currentNode.GetComponent("Node") as Node;
				TNode = testing.GetComponent("Node") as Node;

				float newGcost = Cnode.g + MoveCost;
				if(newGcost < TNode.g){
					TNode.parentnode = currentNode;
					TNode.g = newGcost;
					TNode.calculatetotalcost();
				}
			}
			else{
				Node Cnode;
				Node TNode;
				Cnode = currentNode.GetComponent("Node") as Node;
				TNode = testing.GetComponent("Node") as Node;

			
				TNode.parentnode = currentNode;
				TNode.g = Cnode.g + MoveCost;
				TNode.calculatetotalcost();
				TNode.Open = true;
				AddtoOpenList(testing);
			}
		}

	}
	

	private GameObject GetSmallestFValueNode(){
		GameObject wtf = null;
		Node CheckFirstNodeStats;
		CheckFirstNodeStats = openlist[0].GetComponent("Node") as Node;
		float SmallestFValue = CheckFirstNodeStats.f;
		for(int i = 1; i < openlist.Count; i++){
			Node CheckNodeInArrayStats;
			CheckNodeInArrayStats = openlist[i].GetComponent("Node") as Node;
			if(CheckNodeInArrayStats.f < SmallestFValue){
				SmallestFValue = CheckNodeInArrayStats.f;
				wtf = openlist[i].transform.gameObject;
			}else{	
				wtf = openlist[i].transform.gameObject;
			}
		}

		return wtf;
	}
	

	void TraceBackPath(){
		Node TTNode;
		TTNode = TargetNode.GetComponent("Node") as Node;
		GameObject node = TTNode.parentnode;
		do{
			if(TempList.Contains(node) == false){

				if(node == null){
					Debug.Log("SUCK A FUCKING DICK PROGRAM NO ONE GIVES A SHIT ABOUT YOU");
				}
				if(node != null){
					TempList.Add(node);
				}
				Node nodestats;
				nodestats = node.GetComponent("Node") as Node;
				node = nodestats.parentnode;
			}
	
		}while(node != null);
		TempList.Reverse();
		for(int i = 0; i < TempList.Count; i++){
			if(FinalPath.Contains(TempList[i].gameObject) == false){
				FinalPath.Enqueue(TempList[i]);
			}
		}
		TempList.Clear();
		FinalPath.Enqueue(TargetNode);
		stoppath = true;
	}
	//

	void AddtoOpenList(GameObject node){
		openlist.Add(node);
	}
	
	void AddtoClosedList(GameObject node){
		closedlist.Add(node);
	}

	void RemoveFromOpenList(GameObject node){
		openlist.Remove(node);
	}

	void FindAllHueristicValues(){
		// H = 10*(abs(currentX-targetX) + abs(currentY-targetY))
		// This is the distance from the node to the target.
		for(int i = 0; i < AllNodes.Count; i++){
			float HueristicValue = 10 * (Mathf.Abs(AllNodes[i].transform.position.x - TargetNode.transform.position.x) + (Mathf.Abs (AllNodes[i].transform.position.z - TargetNode.transform.position.z)));
			Node node;
			node = AllNodes[i].GetComponent("Node") as Node;
			node.h = HueristicValue;
		}

	}

	void OnGUI() {
		GUI.Label(new Rect(200, 5, 200, 90), "Open : "+ openlist.Count.ToString());
		GUI.Label(new Rect(200, 20, 200, 90), "Closed : "+ closedlist.Count.ToString());
		GUI.Label(new Rect(200, 35, 200, 90), "Final : "+ FinalPath.Count.ToString());
		GUI.Label(new Rect(200, 50, 200, 90), "T : "+ TempList.Count.ToString());
	}

}
