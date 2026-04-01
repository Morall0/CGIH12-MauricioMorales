#version 330 core
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform Material material;
uniform Light light1; // Fuente 1
uniform Light light2; // Fuente 2

uniform sampler2D texture_diffuse;

vec3 lightResults(Light l)
{
    // Ambient
   vec3 ambient = l.ambient *material.diffuse;
    
    // Diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(l.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = l.diffuse * diff * material.diffuse;
    
    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = l.specular * (spec * material.specular);
    
    vec3 result = ambient + diffuse + specular;

    return result;
}

void main()
{
    vec3 result = lightResults(light1) + lightResults(light2);

    //color = vec4(result, 1.0f);
    color = vec4(result, 1.0f) * texture(texture_diffuse, TexCoords);
}
