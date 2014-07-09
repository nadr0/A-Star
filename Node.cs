using UnityEngine;
using System.Collections;

public class Node : MonoBehaviour {

	public float h = 0;
	public float g = 0;
	public float f = 0;
	public GameObject parentnode = null;
	public GameObject north = null;
	public GameObject south = null;
	public GameObject west = null;
	public GameObject east = null;
	public bool Open = false;
	// Use this for initialization
	void Start () {
		FindSurroundingNodes();
	}
	
	// Update is called once per frame
	void Update () {

	}

	void FindSurroundingNodes(){

		RaycastHit HitNorth;
		RaycastHit HitSouth;
		RaycastHit HitWest;
		RaycastHit HitEast;

		if(Physics.Raycast(transform.position, transform.right, out HitEast, 100f)){
			if(HitEast.transform.tag == "Node"){
				east = HitEast.transform.gameObject;
			}
		}

		if(Physics.Raycast(transform.position, transform.forward, out HitNorth, 100f)){
			if(HitNorth.transform.tag == "Node"){
				north = HitNorth.transform.gameObject;
			}
		}


		if(Physics.Raycast (transform.position, transform.right * -1f, out HitWest, 100f)){
			if(HitWest.transform.tag == "Node"){
				west = HitWest.transform.gameObject;
			}
		}


		if(Physics.Raycast (transform.position, transform.forward * -1f, out HitSouth, 100f)){
			if(HitSouth.transform.tag == "Node"){
				south = HitSouth.transform.gameObject;
			}
		}
	}

	public void calculatetotalcost(){
		f =  h + g;
	}
}
