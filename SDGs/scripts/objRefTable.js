const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.iframe,
		C3.Plugins.Button,
		C3.Plugins.Mouse,
		C3.Plugins.Sprite,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Plugins.Mouse.Acts.SetCursorSprite,
		C3.Plugins.Button.Cnds.OnClicked,
		C3.Plugins.iframe.Acts.NavigateURL
	];
};
self.C3_JsPropNameTable = [
	{iframe: 0},
	{按201: 0},
	{按202: 0},
	{按203: 0},
	{滑鼠: 0},
	{Sprite: 0}
];

self.InstanceType = {
	iframe: class extends self.IIframeInstance {},
	按201: class extends self.IButtonInstance {},
	按202: class extends self.IButtonInstance {},
	按203: class extends self.IButtonInstance {},
	滑鼠: class extends self.IInstance {},
	Sprite: class extends self.ISpriteInstance {}
}