#version 430 core
out vec4 FragColor;
in vec3 cooColor;
in vec3 objColor;
in vec2 texCoord;


uniform sampler2D tex0;


void main()
{
   
   FragColor = texture(tex0, texCoord)*vec4(cooColor*objColor,1.0f);
}