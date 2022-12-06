// ある条件に当てはまる子ノードのみ表示するエレメント
// 直接の子のみ判定可能、子が表示されれば孫も表示され子が否なら孫も否
// 条件の設定はメンバ関数childSelectorを書き換えることで行う
// 個々のノードを引数に受け、それを表示するならtrue否ならfalseを返すこと
// このエレメントクラスを継承するとき、shadowDOMは既に作成されていることに留意
// shadowDOMのmodeの設定はコンストラクタの引数で行う
class ChildLimitingElem extends HTMLElement{
	#slot;#sroot;
	constructor(smode='open'){
		super();
		this.#sroot=this.attachShadow({mode:smode,slotAssignment:'manual'});
		this.#slot=this.#sroot.appendChild(document.createElement('slot'));
		//this.updateをそのまま渡すとthisがMutationObserverになるらしい
		new MutationObserver(()=>this.update()).observe(this,{childList:true});
	}
	childSelector(node){
		return true;
	}
	update(){
		let a=[];
		this.childNodes.forEach((el)=>{if(this.childSelector(el))a.push(el);});
		this.#slot.assign(...a);
	}
	connectedCallback(){
		this.update();
	}
}

class TestElem extends ChildLimitingElem{
	constructor(){
		super('closed');
	}
	childSelector(node){
		return node instanceof HTMLElement?true:false;
	}
}
customElements.define('my-el',TestElem);
