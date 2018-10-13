'use strict';

/** Класс печатает строку помощи. 
 * @class HelpString
 * @author Uvarov Mikhail
 */
module.exports = class HelpString {
	/**
     * Формируем строку.
     * @param {number} nameMaxLenght - максимальная длина названия справки.
     * @param {number} blockMaxLenght - максимальная длина блока справки.
     */
	constructor() {
		this.nameMaxLength = 25;
		this.blockMaxLength = 70;
	}
	
	
	/**
     * Формируем и печатаем строку справки
     * @param {string} name - название.
     * @param {string} description - описание.
     */
	render(name = '', description = '') {
		
		let buffer = name;
		// Формируем первую строку
		if (name.length >= this.nameMaxLength) {
			// Имя больше положенного - выделяем под него 
			// целую строку и отправляем на печать
			this.printBuffer(buffer);
			
			// печатаем описание
			this.printBuffer(description, this.nameMaxLength);
		}
		else {
			// Имя нужной длины
			
			// формируем пустую строку для заполнения имени
			let empty_string = this.emptyString(this.nameMaxLength - name.length);
			
			// печатаем первую строку
			console.log(
					name + 
					empty_string + 
					// подрезаем описание, если оно не влазиет в блок
					description.substring(0, this.blockMaxLength - this.nameMaxLength));
			// проверяем, нужно ли нам продолжать печатать описание
			if (description.length > (this.blockMaxLength - this.nameMaxLength))
			{
				this.printBuffer(
						description.substring(this.blockMaxLength - this.nameMaxLength, description.length), 
						this.nameMaxLength);
			}
		}
	}
	
	/**
     * Выводим в строке макимум по this.blockMaxLength символов
     * @param {string} str - строка, которую разбиваем.
     * @param {int} offset - смещение каретки от начала строки.
     */
	printBuffer(str = '', offset = 0) {
		
		let strCount = 1; // счетчик строк
		
		if (str.length > (this.blockMaxLength - offset)) {
			strCount = Math.ceil(str.length/(this.blockMaxLength - offset));
			
			let empty_string = this.emptyString(offset);
			
			// разбиваем строку на подстроки и выводим подстроки в консоль
			for (let i = 0; i < strCount; i++) {
				console.log(
						empty_string +
						str.substring(
								i*(this.blockMaxLength - offset),
								(i+1)*(this.blockMaxLength - offset)));
			}
		}
		else {
			console.log(this.emptyString(offset) + str);
		}
	}
	
	/**
     * Формируем пустую строку из count символов
     * @param {int} count - кол-вл пустых символов в строке.
     * @return {String} Пустая строка из count символов.
     */
	emptyString(count) {
		let empty_string = '';
		
		for (let i = 0; i  < count; i++)
			empty_string += ' ';
		
		return empty_string;
	}

		
};
