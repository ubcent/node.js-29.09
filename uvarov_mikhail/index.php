<?php

$o = new A();

$o->$B = 5;

class A {
	public $B = 3;
	function setB($value) {
		echo "setB: {$value}";
	}
}