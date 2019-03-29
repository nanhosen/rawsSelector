// // 2. Linking to other objects via the prototype chain
// const obj = {
// 	firstName: 'Ryan'
// }
// console.log(obj.lastName) // undefined

// const protoObj = {
// 	lastName: 'Tippetts'
// }

// Object.setPrototypeOf(obj, protoObj) // set the prototype of obj to be protoObj
// console.log(obj.lastName) // Tippetts
// console.log(Object.getPrototypeOf(obj))
//// ****************************************************************************//

// 3. Prototype Delegation with Javascript's new keyword
// typically in class-based programming languages constructors are special methods
// that are attached to classes, and these special methods are invoked when 
// the 'new' keyword is called on the class. Javascript is NOT typical.
// // Pretty much any function can be called with new in front of it:

// function Car(make) {
// 	this.make = make
// 	this.wheels = 1
// }

// const myCar = new Car('Dodge')
// console.log(myCar)

// // when the new keyword is used on a function three things happen
// // - 1. A brand new object is created (instantiated?) out of thin air
// // 			just like the fed does with fiat money. It's either a completely
// // 			new object or the alternative object returned by the 
// // 			function that 'new' was called on
// // - 2. This newly-created object is 'prototype-linked'
// // - 3. The constructed object is set as the 'this' binding 
// // 			for that function call (the context)
// // console.log(myCar)
// console.log(Car.prototype) // Car {} -- no properties as of yet
// // // so our myCar object is linked to an empty object at this point

// // // but we can add properties to our Car {} prototype object:
// Car.prototype.wheels = 4
// Car.prototype.color = 'silver'
// console.log(Car.prototype) // Car { wheels: 4, color: 'silver' }

// // but if we simply look at our myCar object,
// // none of those properties will show up, we access them via prototypes
// // and the prototype is served up only when the property isn't found on 
// // the object itself
// console.log(myCar.wheels) // Car { make: 'Dodge', wheels: 1 }
// Car.wheels = 5
// console.log(myCar.wheels) // 1 (wheels is on both the object and it's prototype)
// console.log(myCar.color) // silver (not on the object but on the prototype)

// // // When the new keyword is used on a function it's called a constructor call,
// // // and these functions are typically capitalized (note React component style conventions)

// // // literals and constructed forms:

// // // literal form:
// console.log([]) // []
// console.log({}) // {}

// // // constructed form (typically preferred):
// const obj = new Object()
// const arr = new Array()
// // same outputs as the literals above
// console.log(obj) // {} 
// console.log(arr) // []

//// ****************************************************************************//

// // 4. Understanding the .constructor property on JS objects
// function Foo() {
// 	// ..
// }

// console.log(Foo.prototype.constructor) // [Function: Foo]

// const a = new Foo()
// console.log(a.constructor === Foo) // true
// // // But: the a.constructor object property does not live on 
// // // the newly-created object 'a' - rather it lives elsewhere
// // // further down the prototype chain, basically when we call
// // // a.constructor the interpreter searches the prototype chain
// // // for the constructor property on Foo's prototype object

// // // because of the relationship between new object created from 
// // // the 'new' keyword and the Foo function, it would be easy to 
// // // assume that the constructor property would always reference 
// // // the object that created it. However, this is not true

// // // We can reassign Foo's prototype to be a new object literal 
// // // (global Object constructor function):
// Foo.prototype = {}
// const b = new Foo()

// // // By doing this mutation, our call from 'b' to the constructor property
// // // will return the global constructor object function:
// console.log(Foo.prototype.constructor) // [Function: Object]

// console.log(b.constructor === Foo) // false
// // // to return a true value once again we can reference the global 
// // // object constructor function:
// console.log(b.constructor === Object) // true

// // We can play with this idea even more:
// Object.defineProperty(Foo.prototype, 'constructor', {
// 	enumerable: false,
// 	writable: true,
// 	configurable: true,
// 	value: Foo // and basically we're hiding a new prototype constructor here 
// })

// console.log(Foo.prototype.constructor) // [Function: Foo]
// const c = new Foo()

// console.log(c.constructor === Foo) // true
// console.log(c.constructor === Object) // false

// // so we're basically back to where we started even though we're 
// // redefining Foo's prototype just to be some anonymous global object

//// ****************************************************************************//

// 5. Understand JavaScript's "this" keyword within Prototypes
// 'use strict'
// function Foo(name) {
// 	this.name = name
// }

// Foo.prototype.myName = function() {
// 	return this.name
// }

// // function Bar(name) {
// // 	console.log(this)
// // 	Foo(name)
// // }
// function Bar(name) {
// 	Foo.call(this, name)
// }

// // const a = new Bar('Bill')
// // console.log(a.myName()) // error: a.myName is not a function

// // // We're trying to access a method that lives on the Foo prototype,
// // // But we created our variable with the Bar function
// // // At this point Foo's prototype is not chained to Bar
// // // So to link them together we can do the following:

// Bar.prototype = Object.create(Foo.prototype)
// const b = new Bar('Cuda')
// console.log(b.myName()) // undefined, no error though

// // But what we're trying to do is have 'Cuda' be returned from 
// // b.myName(), which is invoked by the Foo(name) function from 
// // within the Bar(name) function

// // What happens though is that when we created 'b' we used the 'new'
// // keyword, so the 'this' context used within the excuting function
// // is directed to the newly-created object 'b'

// // but if we add a 'use strict' to the top of this section, 
// // we'll immediately start to get a bunch of errors because
// // 'use strict' enforces a bunch of stuff, in particular, it 
// // requires us to ensure that our this context is not undefined 
// // or pointed at the global scope  

// // So, we need to invoke the Foo Function with the correct context
// // using Foo.call(this, name)
// console.log(b.myName()) // 'Cuda' just like what we wanted

// // This works because we are controlling the "this" context 
// // used within the Foo function by passing to it the context
// // used within the Bar function that was created when we used
// // the 'new' keyword which is directed to the newly created
// // object assigned to the 'b' const variable:
// console.log(b.name) // Foo { name: 'Cuda' }
// // we can see that the property name is actually being assigned
// // now that we have the correct context passed through 

// // It's also good to note that the 'this' context of the 
// // Foo.prototype.myName function--even though its a few
// // objects down the prototype chain--the 'this' context still points
// // to the 'b' const object. It can be easy to mistakenly believe that
// // the this context is on the next-in-line prototype object--but that's 
// // not the case. 

//// ****************************************************************************//

// // 6. Using for-in Loop on Objects with prototypes: Loops can behave 
// // differently when objects have chained prototype objects. Exhibit A....

// // Loops give us the ability to iterate over items in collections
// const obj = {
// 	firstName: 'Bill',
// 	lastName: 'Baracosa'
// }

// let n = 0
// for (let property in obj) {
// 	n++
// }
// console.log(n) // 2

// const protoObj = {
// 	hair: 'Busey blonde'
// }
// Object.setPrototypeOf(obj, protoObj)

// n = 0
// for (let property in obj) {
// 	n++
// }
// // it's also iterating over the properties on the prototype
// console.log(n) // 3 // even though we didn't change the properties
// // // on our original object, because the for loop iterates over the 
// // // object properties object by object

// // // to remedy this behavior if so desired:
// n = 0
// for (let property in obj) {
// 	// hasOwnProperty returns a boolean 
// 	if (obj.hasOwnProperty(property)) {
// 		n++
// 	}
// }
// console.log(n) // 2 -- back to where we were before

// // // It's important to note that the for-loop will only
// // // iterate over distinct properties
// // // if we remove that conditional hasOwnProperty
// // // and simultaneously rename the 'hair' property as 'lastName':

// const newProtoObj = { lastName: 'Busey blonde' }
// Object.setPrototypeOf(obj, newProtoObj)
// n = 0
// for (let property in obj) { n++ }
// console.log(n) // back to 2 again

//// ****************************************************************************//

// // 7. Compose Objects with Object.assign to Create a Direct Copy
// // Coupling objects together can create a brittle relationship. 
// // If the prototype object is mutated or replaced later in development,
// // Instead, you can use Object.assign to compose objects. This method 
// // creates a direct copy of all properties and does not reference the source
// // object's properties in memory

// // here's a classic/typical example of prototypal inheritance
// const parent = {
// 	hair: 'brown',
// 	heightInInches() {
// 		return this.height * 12
// 	}
// }

// // create brand new object with parent as the designated 
// // next-in-line in the prototype chain object
// const child = Object.create(parent)
// child.height = 6

// const newChild = Object.assign({ height: 6 }, parent)

// console.log(child.heightInInches()) // 72
// // so the method .heightInInches() works in this case because
// // we've assigned the parent object to be the parent 
// // of the child object

// // Now if we did:
// parent.heightInInches = () => true
// console.log(child.heightInInches()) // true
// // so it's important to remember that when using prototypal
// // inheritance that you need to remember not to update parent-like
// // objects because it can mess with child-like implementations
// // down the road that depend on those properties

// // As a safety net we can use Object.assign instead of Object.create
// console.log(newChild.heightInInches())
// console.log(newChild)
// // As we can see, because we created newChild via Object.assign
// // before we changed the heightInInches method on the parent object
// // prototype, all of the parent's original methods are copied directly 
// // to the newChild object at that moment, and the parent is no longer 
// // in the prototype chain:
// // { height: 6,
// //   hair: 'brown',
// //   heightInInches: [Function: heightInInches] }

//// ****************************************************************************//

// // 8. Understanding Prototype Delegation within JavaScript's Class keyword
// // The ES6 Class keyword is syntactical sugar for working with functions 
// // and prototypes. It is not to be confused with classes in classical languages
// // like Java and C#. It's functionality seems to replicate classical behavior but
// // still has significant differences. 

// // class newCar {}
// // console.log(newCar) // [Function: newCar] 
// // // classes are just functions, so they will have a protoype

// class Vehicle {
// 	isLegal() {
// 		return true
// 	}
// }

// class Car extends Vehicle {
// 	canBeUsed() {
// 		// this represents the new object we get by using the 'new' keyword
// 		// to instantiate a new Car object below
// 		return this.isLegal()  
// 	}
// }

// // console.log(typeof Vehicle.prototype) // object
// // console.log(new Car().canBeUsed()) // true
// // new Car is prototype linked to Car's prototype object Vehicle
// // through the use of the 'extends' keyword
// // methods and properties that are written inside of a class are not copied 
// // from one class to another as is usually the case with classical inheritance
// // instead they are created on the prototype object of that class, so if we do:
// const myCar = new Car()
// console.log(myCar.isLegal())
// console.log(Object.getPrototypeOf(myCar) === Car.prototype) // true
// // the getPrototypeOf method returns the prototype that is next
// // in line on the prototype chain, this is the same result you would get
// // if you wrote this as a function and not as a class, so if we did:
// console.log(
// 	Object.getPrototypeOf(Car.prototype) === Vehicle.prototype
// ) // true
// // but this is false
// console.log(
// 	Object.getPrototypeOf(myCar) === Vehicle.prototype
// )  // false

// // So because of the use of the extends key word, the Car's prototype object
// // and not the Class itself is prototype-linked to the Vehicle's prototype
// // object and we're only able to have access to the .isLegal function because
// // .isLegal lives on the Vehicle's prototype and not on the class itself:
// // console.log(Vehicle.isLegal()) // returns  TypeError: Vehicle.isLegal is not a function
// // to get this to work we'd need to use the "static" keyword

// // so to invoke the .isLegal method on the prototype object we would do:
// console.log(Vehicle.prototype.isLegal()) // true

//// ****************************************************************************//

// 9. Assign and Access Methods of a JavaScript Class with Static properties
// When used, the static keyword assigns properties and methods to the class
// itself. Here, as opposed to assigning it to the prototype object of that Class,
// we'll use the static keyword and show how to replicate the same behavior 
// with a regular function:

// If we had the following class and a method:
// class Food {
// 	isHealthy() { return true }
// }

// and we were to:
// console.log(Food.isHealthy()) // Food.isHealthy is not a function
// this is because .isHealthy is not written to the class but is instead 
// actually attached to the prototype object of our class Food

// // So for us to be able to add this function we'll have to do:
// class Food {
// 	static isHealthy() { return true }
// }
// // // this means the isHealthy method will now be assigned to the Class itself
// // and not to the class's protoype, so:
// console.log(Object.getPrototypeOf(Food).isHealthy()) // .isHealthy is not a function

// This would be the same thing as creating a function:
// function Food() {

// }
// Food.isHealthy = () => true
// console.log(Food.isHealthy()) // true

// so what this shows us is that static properties can be called within it's 
// own class

// we can also refactor the class to use the 'this' keyword:
// class Food {
// 	static isHealthy() {
// 		return true
// 	}
// 	static canBeEaten() {
// 		return this.isHealthy() // 'this' references the Food class itself
// 	}
// }
// console.log(Food.canBeEaten()) // returns 'true'

//// ****************************************************************************//

// 10. Determine an Object's Constructor with JavaScript's instanceof Operator
// The instanceof operator can be used to figure out which function created an 
// object. However it does have its drawbacks, such as returning false results. 
// So you have to understand how the instanceof method determines which function
// created an object and we'll learn how to manipulate the results

// function Car(make) {
// 	this.make = make
// }

// const myCar = new Car('Dodge')
// console.log(myCar instanceof Car) // true
// the instanceof operator tests whether the prototype property of a constructor
// appears anywhere in the prototype chain of our object. So all the instanceof
// operator is doing is checking all the prototype object's .constructor properties
// on our myCar object to see if any of them points to the Car function

// function Boat(engine) {
// 	this.engine = engine
// }

// Object.setPrototypeOf(Boat.prototype, Car.prototype)

// // So now if we new'd up Boat instead of Car for our const myCar:
// const myCar = new Boat('Dodge')
// // we can see that our instanceof still is 'true'
// console.log(myCar instanceof Car) // true

// this might seem off because our myCar object appears to really be 
// instance of Boat and not of Car, but because we delegated the next-in-line
// prototype chain object of Boat's prototype to be Car.prototype, our 
// instanceof operator finds the Car function and returns true

// // if we were to refactor our functions as classes this would not affect anything:
class Car {
	constructor(make) {
		this.make = true
	}
}
class Boat {
	constructor(engine) {
		this.engine = engine
	}
}
const myCar = new Boat('Dodge')
Object.setPrototypeOf(Boat.prototype, Car.prototype)
console.log(myCar instanceof Car) // true

//// ****************************************************************************//

// // 11. Create Factory Functions for Object Composition
// // Factory functions can be powerful ways of abstracting away difficult 
// // inheritance situations. They are simply functions that return objects
// // in a desired state. So here we'll refactor some objects that share
// // duplicated code to a reusable factory function

// // const ryan = {
// // 	hair: 'brown',
// // 	height: '6 foot three',
// // 	type: 'human'
// // }

// // const nanette = {
// // 	hair: 'blonde',
// // 	height: '5 foot 4',
// // 	type: 'human'
// // }

// // // say we wanted to eventually change the type of all the human type objects
// // // to 'creature' and we didn't want to update all the human objects manually,
// // // so we could set the human's prototype object:
// // const human = {
// // 	type: 'human'
// // }

// // const ryan = {
// // 	hair: 'brown',
// // 	height: '6 foot three',
// // }

// // const nanette = {
// // 	hair: 'blonde',
// // 	height: '5 foot 4',
// // }
// // Object.setPrototypeOf(ryan, human)
// // Object.setPrototypeOf(nanette, human)

// // // this seems tedious however to set each human object's prototype to 
// // // human prototype, so let's create a person function instead:
// // const createUser = character => ({
// // 	...character, // destructure out all the person's traits and asign it to be 'human'
// // 	type: 'human'
// // })

// // // so instead of setting the prototype we'll actually just call this function
// // // in order to pass in these objects with the attributes we care about:
// // const ryan = createUser({
// // 	hair: 'brown',
// // 	height: '6 foot three',
// // })

// // const nanette = createUser({
// // 	hair: 'blonde',
// // 	height: '5 foot 4',
// // })
// // console.log(nanette.type) // human

// // // by refactoring the above into a function, we've created what's called
// // // a "factory function" => which is anything that is not called with the
// // // "new" keyword and still returns a new object

// // // by using factory functions we're not duplicating code relying upon 
// // // prototypes or inheritance to get things done, yet we still have the 
// // // ability to change our object's type attributes pretty easily

// // // a good rule of thumb:
// // // Use object literals for one,
// // // and factories for many

// // now that we have the Factory Function we can get it to behave somewhat
// // similarly to an interface => we could make sure that each character object
// // has a property of smart by giving it a default parameter value of 'true'
// const createUser = (character, smart = true) => ({
// 	smart, // by putting it above the 'character' attr, it can be overridden
// 	...character, 
// 	type: 'human'
// })
// const nanette = createUser({
// 	hair: 'blonde',
// 	height: '5 foot 4',
// })
// console.log(nanette) 
// // { smart: true, hair: 'blonde', height: '5 foot 4', type: 'human' }
// // factory functions provide a dynamic method for creating multiple objects
// // with similar characteristics

//// ****************************************************************************//

// // 12. Use Polymorphism with Prototype Linked Objects
// // Polymorphism is a powerful tool in many classical languages. However, it
// // obviously works differently in JavaScript and it's important to understand
// // the requirements of when a property can be overridden.
// // const foo = {
// // 	name: 'ryan'
// // }

// // const bar = {
// // 	lastName: 'tippetts'
// // }
// // // set bar's next-in-chain prototype to be foo
// // Object.setPrototypeOf(bar, foo) 
// // console.log(bar.name) // ryan -- even though 'name' lives on foo and not bar

// // // Polymorphism, or 'shadowing', is when an inherited property is redefined
// // // properties that live on the prototype chain can be redefined in all but two
// // // cases:
// // // 'use strict' // would cause an error if we used strict mode
// // // while trying to redefine properties that are 'writable: false'
// // const foo = {
// // 	// name: 'ryan'
// // }
// // //  if we commented out name inside of foo and did:
// // Object.defineProperty(foo, 'name', {
// // 	value: 'ryan',
// // 	writable: false // this means we cannot assign this property another value
// // })

// // const bar = {
// // 	lastName: 'tippetts'
// // }
// // // set bar's next-in-chain prototype to be foo
// // Object.setPrototypeOf(bar, foo) 
// // bar.name = 'nanette'
// // console.log(bar.name) // still returns 'ryan' rather than 'nanette'
// // // because of 'writable: false' we cannot assign that property to 
// // // down-the-chain objects. So even though bar's configuration does not have
// // // any sort of 'writable: false' attribute, foo's configuration controls
// // // on down the chain, so we cannot re-set it.

// // if we were to get rid of Object.defineProperty and instead use a 'setter'
// const foo = {
// 	set name(name) {
// 		this.currentName = name // just default to 'name'
// 	}
// }
// const bar = {
// 	lastName: 'tippetts'
// }
// Object.setPrototypeOf(bar, foo) 
// bar.name = 'nanette'
// console.log(bar.name) // this now returns 'undefined'
// // if the property is a setter on the chain then the property will
// // always be called. The property will not be added to our bar object
// // and attempting to redefine it to be 'nanette' will ineffective

// // but if we:
// console.log(bar) // { lastName: 'tippetts', currentName: 'nanette' }
// // which means currentName has been defined to be 'nanette' on bar
// // so to recap, properties down the chain can be redefined in all but two cases,
// // a configuration up the chain exists for the property of 'writable: false'
// // or it's defined as a 'setter' it cannot be added
// // with strict mode enabled we would get an error should we attempt to 
// // enact it down the chain.

//// ****************************************************************************//

// // 13. Replicate JavaScript Constructor Inheritance with Simple Objects (OLOO)
// // If you get lost using the 'new' keyword with functions, you can work around it
// // Prototypal inheritance can be completely replicated without either of those two
// // concepts. So we're going to convert an object created from the new keyword
// // against a function, to simply a series of objects linked to other other objects
// // function House(color) {
// // 	this.color = color
// // }

// // const myHouse = new House('white')
// // console.log(myHouse.color) // we get white
// // This probably accomplishes what you're trying to do in the end, 
// // but it may not be the best option
// // The 'new' keyword not only calls a function, but also creates a 
// // new object, points the 'this' context at the newly-created function,
// // and links up the prototype chain. We could probably go about this
// // in a manner that is a little more straightforward

// // Instead, we could change this function to just be a regular object
// // called house, and move the this.color assignment into a setter:
// const house = {
// 	set houseColor(color) {
// 		this.color = color
// 	}
// }
// // instead of 'new House' just do:
// const myHouse = Object.create(house)

// // and call the house setter method and passing in the desired prop value
// console.log(myHouse.houseColor = 'white') // returns white
// console.log(myHouse) // { color: 'white' } - the color has been added for us
// // This pattern is called OLOO, or rather, Objects Linking to Other Objects
// // Object.create gives us the ability to easily create new objects that have
// // specifically-delegated prototype objects
